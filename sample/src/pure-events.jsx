import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph, PureStore} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer} from './utils';

class Node extends PureGraph.MovableNode {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [left, top] = [this.position.x, this.position.y];
        const style = {left, top};
        return (
            <div draggable className="node" ref="point" style={style} {...handlers}>
                {this.props.node.id}
            </div>
        );
    }

    getEndPosition () {
        return this.position;
    }

    onDoubleClick (event) {
        event.stopPropagation();
        this.props.onNodeRemove(this.props.node);
    }

    onDragStart (event) {
        if (event.ctrlKey) {
            this.moveHandlers.onMoveStart(event);
        } else {
            event.dataTransfer.setData('linkSrcEnd', JSON.stringify(this.props.node));
            this.props.onLinkStart(event, this.props.node);
        }
    }

    onDrag (event) {
        if (event.ctrlKey || this.moving) {
            this.moveHandlers.onMove(event);
        } else {
            this.props.onLink(event);
        }
    }

    onDragEnd (event) {
        if (event.ctrlKey || this.moving) {
            this.moveHandlers.onMoveFinish(event);
            this.props.onNodeUpdate(this.props.node, { position: this.position });
        } else {
            this.props.onLinkFinish(event);
        }
    }

    onDragEnter (event) {
        event.preventDefault();
    }

    onDragOver (event) {
        event.preventDefault();
    }

    onDrop (event) {
        const src = JSON.parse(event.dataTransfer.getData('linkSrcEnd') || "false");
        if (src) {
            const dst = this.props.node;
            this.props.onNodeLinkMake(src, dst);
        }
    }
}

class Edge extends PureGraph.Edge {
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


import {PureGraphSample as initData} from './sample';
const {makeNode, makeEdge, assign, when, predicate} = PureStore;
const is = predicate;

class Graph extends PureGraph.LinkableGraph(Node, Edge) {
    makeGraphProps () { return Object.assign(super.makeGraphProps(), selectBindedPrototypes(this, /^onDoubleClick/)); }
    makeNodeProps (node) { return Object.assign(super.makeNodeProps(node), selectBindedPrototypes(this, /^onNode/), this.linkHandlers); }
    makeEdgeProps (edge) { return Object.assign(super.makeEdgeProps(edge), selectBindedPrototypes(this, /^onEdge/)); }

    constructor (props) {
        super(props);
        this.state = initData;
    }

    prepareGraph () {
        this.nodes = this.state.nodes;
        this.edges = this.state.edges;
    }

    onDoubleClick (event) {
        this.setState({
            nodes: this.state.nodes.concat(makeNode(pointer(event)))
        }, this.forceUpdate.bind(this));
    }

    onNodeRemove (node) {
        this.setState({
            nodes: this.state.nodes.filter(is.notSameAs(node)),
            edges: this.state.edges.filter(is.notLinking(node)),
        }, this.forceUpdate.bind(this));
    }

    onNodeUpdate (node, update) {
        this.setState({
            nodes: this.state.nodes.map(when(is.sameAs(node))(assign(update)))
        }, this.forceUpdate.bind(this));
    }

    onNodeLinkMake (src, dst) {
        this.setState({
            edges: this.state.edges.concat(makeEdge(src, dst))
        }, this.forceUpdate.bind(this));
    }

    onEdgeRemove (edge) {
        this.setState({
            edges: this.state.edges.filter(is.notSameAs(edge))
        }, this.forceUpdate.bind(this));
    }
};

ReactDOM.render(<Graph />, document.getElementById("container"));


