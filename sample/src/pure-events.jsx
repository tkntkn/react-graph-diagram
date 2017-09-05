import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer, dummyImage} from './utils';
import {PureData, DataHandler, PointerEnd, NewPureEdge, NewPureNode} from './data';
import {Movable} from './movable';
// import {Linkable} from './linkable';

const check = v => [console.log(v), v][1];

const MovablePureNode = Movable(PureGraph.Node, {
    trigger: event => event.ctrlKey,
    propsToPosition: props => props.node.position
})

const Node = class extends MovablePureNode {
    render () {
        const handlers = selectBindedPrototypes(this, /^on/);
        const [left, top] = [this.position.x, this.position.y];
        const style = {left, top};
        if (this.props.node.id === PointerEnd().id) {
            // style.display = 'none';
            style.pointerEvents = 'none';
        }
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
        if ( super.onDragStart(event) ) {
            ;
        } else {
            event.dataTransfer.setData('endDrag', JSON.stringify(this.props.node));
            this.props.onEndLinkingStart(this.props.node, pointer(event));
        }
    }

    onDrag (event) {
        if ( super.onDrag(event) ) {
            ;
        } else {
            this.props.onEndLinking(this.props.node, pointer(event));
        }
    }

    onDragEnd (event) {
        if ( super.onDragEnd(event) ) {
            this.props.onNodeUpdate(this.props.node, { position: this.position });
        } else {
            this.props.onEndLinkingEnd(this.props.node, pointer(event));
        }
    }

    onDragEnter (event) {
        event.preventDefault();
    }

    onDragOver (event) {
        event.preventDefault();
    }

    onDrop (event) {
        const src = JSON.parse(event.dataTransfer.getData('endDrag') || "false");
        this.props.onEndLink(src, this.props.node);
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

const Graph =  class extends PureGraph.Graph(Node, Edge) {
    constructor (props) {
        super(props);
        this.state = PureData;
        this.graphEventHandlers = {
            onDoubleClick: this.onDoubleClick.bind(this)
        };
        this.nodeEventHandlers = Object.assign({},
            selectBindedPrototypes(this, /^onNode/),
            selectBindedPrototypes(this, /^onEnd/),
        );
        this.edgeEventHandlers = selectBindedPrototypes(this, /^onEdge/);
    }

    prepareGraph () {
        this.nodes = this.state.nodes;
        this.edges = this.state.edges;
        this.dataHandler = DataHandler(this.state);
    }

    makeGraphProps () { return Object.assign(super.makeGraphProps(), this.graphEventHandlers); }
    makeNodeProps (node) { return Object.assign(super.makeNodeProps(node), this.nodeEventHandlers); }
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

    onEdgeRemove (edge) {
        const state = this.dataHandler.removeEdge(edge);
        this.setState(state, this.forceUpdate.bind(this));
    }

    onEndLinkingStart (node, position) {
        this.ptrnode = PointerEnd(position);
        const state = this.dataHandler.addNodeEdge(this.ptrnode, NewPureEdge(this.ptrnode, node));
        this.setState(state, this.forceUpdate.bind(this, () => this.refs[this.ptrnode.id].updatePosition(position, true)));
    }

    onEndLinking (node, position) {
        this.refs[this.ptrnode.id].updatePosition(position, true);
    }

    onEndLinkingEnd (node, position) {
        this.refs[this.ptrnode.id].updatePosition(position, false);
        this.setState(this.dataHandler.removeNode(this.ptrnode), this.forceUpdate.bind(this));
        this.ptrnode = false;
    }

    onEndLink (src, dst) {
        if (src && dst) {
            this.setState(this.dataHandler.addEdge(NewPureEdge(src, dst)), this.forceUpdate.bind(this));
        }
    }
};

ReactDOM.render(<Graph />, document.getElementById("container"));
