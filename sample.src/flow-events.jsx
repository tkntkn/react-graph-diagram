import React from 'react';
import ReactDOM from 'react-dom';
import {FlowGraph, FlowStore} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer} from './utils';

class Node extends FlowGraph.MovableNode {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [left, top] = [this.position.x, this.position.y];
        const inlets  = this.props.children.filter(child => child.props.port.flow === 'in');
        const outlets = this.props.children.filter(child => child.props.port.flow === 'out');
        return (
            <div draggable className="node" ref="point" style={{left, top}} {...handlers}>
                {this.props.node.id}
                <div className="ports in">{inlets.map(React.cloneElement)}</div>
                <div className="ports out">{outlets.map(React.cloneElement)}</div>
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

class Port extends FlowGraph.Port {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const className = `port ${this.props.port.flow}`;
        return <span draggable ref="point" className={className} {...handlers} />
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

class Edge extends FlowGraph.Edge {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [a, b] = [this.ends.src, this.ends.dst];
        const diff = Math.abs(a.y - b.y);
        const p1 = `${a.x},${a.y}`;
        const p2 = `${a.x},${a.y + diff + 30}`;
        const p3 = `${b.x},${b.y - diff - 30}`;
        const p4 = `${b.x},${b.y}`;
        const d = `M${p1} C${p2} ${p3} ${p4}`;
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

import {FlowGraphSample as initData} from './sample';
const {makeNode, makeEdge, assign, when, predicate} = FlowStore;
const is = predicate;

class Graph extends FlowGraph.LinkableGraph(Node, Port, Edge) {
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
            nodes: this.state.nodes.concat(makeNode(pointer(event), {in:Math.floor(Math.random()*3+1), out:Math.floor(Math.random()*3+1)}))
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

ReactDOM.render(<Graph>{initData}</Graph>, document.getElementById("container"));
