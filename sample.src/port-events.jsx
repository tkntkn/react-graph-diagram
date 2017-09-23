import React from 'react';
import ReactDOM from 'react-dom';
import {PortGraph, PortStore} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer, polar} from './utils';

class Node extends PortGraph.MovableNode {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [left, top] = [this.position.x, this.position.y];
        const style = {left, top};
        return (
            <div draggable className="node" ref="point" style={style} {...handlers}>
                {this.props.node.id}
                {this.props.children.map((child,i,a) => {
                    const {x,y} = polar(26, 2*Math.PI*(i/a.length));
                    const style = {position: 'absolute', left:`${20+x}px`, top:`${20+y}px`};
                    return <div key={i} style={style}>{React.cloneElement(child)}</div>
                })}
            </div>
        );
    }

    onDoubleClick (event) {
        event.stopPropagation();
        this.props.onNodeRemove(this.props.node);
    }

    onDragStart (event) {
        this.moveHandlers.onMoveStart(event);
    }

    onDrag (event) {
        this.moveHandlers.onMove(event);
    }

    onDragEnd (event) {
        this.moveHandlers.onMoveFinish(event);
        this.props.onNodeUpdate(this.props.node, { position: this.position });
    }
}

class Port extends PortGraph.Port {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const {x,y} = polar(26, 2*Math.PI*(this.props.port.index/6));
        return <span draggable ref="point" className="port" {...handlers} />;
    }

    getEndPosition () {
        const rect = this.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
    }

    onDragStart (event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        event.dataTransfer.setData('linkSrcEnd', JSON.stringify(this.props.port));
        this.props.onLinkStart(event, this.props.port);
    }

    onDrag (event) {
        event.stopPropagation();
        this.props.onLink(event);
    }

    onDragEnd (event) {
        event.stopPropagation();
        this.props.onLinkFinish(event);
    }

    onDragEnter (event) {
        event.preventDefault();
    }

    onDragOver (event) {
        event.preventDefault();
    }

    onDrop (event) {
        const src = JSON.parse(event.dataTransfer.getData('linkSrcEnd') || "false");
        if (src) this.props.onLinkMake(src, this.props.port);
    }
}

class Edge extends PortGraph.Edge {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [a, b] = [this.ends.src, this.ends.dst];
        const d = `M${a.x},${a.y} L${b.x},${b.y}`;
        return (
            <g>
                <path className="edge" d={d} />
                <path className="edge-wrapper" d={d} {...handlers} />
            </g>
        );
    }

    onDoubleClick (event) {
        event.stopPropagation();
        this.props.onEdgeRemove(this.props.edge);
    }
}

import {PortGraphSample as initData} from './sample';
const {makeNode, makeEdge, assign, when, predicate} = PortStore;
const is = predicate;

class Graph extends PortGraph.LinkableGraph(Node, Port, Edge) {
    makeGraphProps () { return Object.assign(super.makeGraphProps(), selectBindedPrototypes(this, /^onDoubleClick/)); }
    makeNodeProps (node) { return Object.assign(super.makeNodeProps(node), selectBindedPrototypes(this, /^onNode/)); }
    makeEdgeProps (edge) { return Object.assign(super.makeEdgeProps(edge), selectBindedPrototypes(this, /^onEdge/)); }
    makePortProps (port) { return Object.assign(super.makePortProps(port), selectBindedPrototypes(this, /^onLink/), this.linkHandlers); }

    constructor (props) {
        super(props);
        this.state = initData;
    }

    prepareGraph (props=this.props, state=this.state) {
        this.nodes = state.nodes;
        this.edges = state.edges;
    }

    onDoubleClick (event) {
        this.setState({
            nodes: this.state.nodes.concat(makeNode(pointer(event), Math.floor(Math.random() * 10 + 1)))
        });
    }

    onNodeRemove (node) {
        this.setState({
            nodes: this.state.nodes.filter(is.notSameAs(node)),
            edges: this.state.edges.filter(is.notLinking(node)),
        });
    }

    onNodeUpdate (node, update) {
        this.setState({
            nodes: this.state.nodes.map(when(is.sameAs(node))(assign(update)))
        });
    }

    onLinkMake (src, dst) {
        this.setState({
            edges: this.state.edges.concat(makeEdge(src, dst))
        });
    }

    onEdgeRemove (edge) {
        this.setState({
            edges: this.state.edges.filter(is.notSameAs(edge))
        });
    }
}

ReactDOM.render(<Graph />, document.getElementById("container"));
