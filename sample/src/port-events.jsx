import React from 'react';
import ReactDOM from 'react-dom';
import {PortGraph, Movable, Linkable, BaseGraph} from 'react-graph-diagram';
import {selectBindedPrototypes, pointer, polar} from './utils';
import {PortData, DataHandler, NewEdge, NewPortNode, POINTER_END_ID} from './data';

const DummyEnd = Movable(class extends BaseGraph.End {
        render () {
            return null;
        }

        getEndPosition () {
            return this.position;
        }
    }, {
        propsToPosition: props => props.node.position
    }
);

const MovablePortNode = Movable(PortGraph.Node, {
    propsToPosition: props => props.node.position
});

class Node extends MovablePortNode {
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

    onDragEnd (event) {
        super.onDragEnd(event);
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
        event.dataTransfer.setData('linkSrcEnd', JSON.stringify(this.props.port));
        this.props.onLinkStart(event, this.props.port);
    }

    onDrag (event) {
        this.props.onLink(event);
    }

    onDragEnd (event) {
        this.props.onLinkEnd(event);
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

const LinkablePureGraph = Linkable(PortGraph.Graph(Node, Port, Edge), {})

class Graph extends LinkablePureGraph {
    constructor (props) {
        super(props);
        this.state = PortData;
        this.graphEventHandlers = {
            onDoubleClick: this.onDoubleClick.bind(this)
        };
        this.nodeEventHandlers = selectBindedPrototypes(this, /^onNode/);
        this.edgeEventHandlers = selectBindedPrototypes(this, /^onEdge/);
        this.portEventHandlers = selectBindedPrototypes(this, /^onLink/);
    }

    prepareGraph () {
        this.nodes = this.state.nodes;
        this.edges = this.state.edges;
        this.dataHandler = DataHandler(this.state);
        super.prepareGraph();
    }

    renderNode (node) {
        if (node.id === "react-graph-diagram::POINTER_END_ID") {
            return <DummyEnd
                key={node.id} ref={node.id}
                {...this.makeNodeProps(node)}
                {...this.makeEndProps(node)}
            />
        } else {
            return super.renderNode(node);
        }
    }

    makeGraphProps () { return Object.assign(super.makeGraphProps(), this.graphEventHandlers); }
    makeNodeProps (node) { return Object.assign(super.makeNodeProps(node), this.nodeEventHandlers); }
    makeEdgeProps (edge) { return Object.assign(super.makeEdgeProps(edge), this.edgeEventHandlers); }
    makePortProps (port) { return Object.assign(super.makePortProps(port), this.portEventHandlers); }

    onDoubleClick (event) {
        const newnode = NewPortNode(pointer(event));
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

    onLinkMake (src, dst) {
        const state = this.dataHandler.addEdge(NewEdge(src, dst));
        this.setState(state, this.forceUpdate.bind(this));
    }
}

ReactDOM.render(<Graph />, document.getElementById("container"));
