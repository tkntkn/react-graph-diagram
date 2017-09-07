import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph, Movable, Linkable} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer} from './utils';
import {PureData, DataHandler, NewEdge, NewPureNode} from './data';

const check = v => [console.log(v), v][1];

const MovablePureNode = Movable(PureGraph.Node, {
    propsToPosition: props => props.node.position
})

const Node = class extends MovablePureNode {
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

const Edge = class extends PureGraph.Edge {
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

const LinkablePureGraph = Linkable(PureGraph.Graph(Node, Edge), {});

const Graph =  class extends LinkablePureGraph {
    constructor (props) {
        super(props);
        this.state = PureData;
        this.graphEventHandlers = selectBindedPrototypes(this, /^onDoubleClick/);
        this.nodeEventHandlers = selectBindedPrototypes(this, /^onNode/);
        this.edgeEventHandlers = selectBindedPrototypes(this, /^onEdge/);
    }

    prepareGraph () {
        this.nodes = this.state.nodes;
        this.edges = this.state.edges;
        this.dataHandler = DataHandler(this.state);
        super.prepareGraph();
    }

    makeGraphProps () { return Object.assign(super.makeGraphProps(), this.graphEventHandlers); }
    makeNodeProps (node) { return Object.assign(super.makeNodeProps(node), this.nodeEventHandlers, this.linkHandlers); }
    makeEdgeProps (edge) { return Object.assign(super.makeEdgeProps(edge), this.edgeEventHandlers); }

    onDoubleClick (event) {
        const newnode = NewPureNode(pointer(event));
        const state = this.dataHandler.addNode(newnode);
        this.setState(state, this.forceUpdate.bind(this));
    }

    onNodeRemove (node) {
        const state = this.dataHandler.removeNode(node);
        this.setState(state, this.forceUpdate.bind(this));
    }

    onNodeUpdate (node, update) {
        const state = this.dataHandler.updateNode(node, update);
        this.setState(state, this.forceUpdate.bind(this));
    }

    onNodeLinkMake (src, dst) {
        const state = this.dataHandler.addEdge(NewEdge(src, dst));
        this.setState(state, this.forceUpdate.bind(this));
    }

    onEdgeRemove (edge) {
        const state = this.dataHandler.removeEdge(edge);
        this.setState(state, this.forceUpdate.bind(this));
    }
};

ReactDOM.render(<Graph />, document.getElementById("container"));
