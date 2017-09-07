import React from 'react';
import * as Base from './base';
import * as PureGraph from './pure';
import {Movable} from '../extensions/movable';
import {Linkable} from '../extensions/linkable';
import {NArray} from '../utils';

const portId = port => port.id || `port-${port.node}-${port.index}`;
const endWithId  = end  => Object.assign({}, end,  {id: portId(end)})
const edgeWithId = edge => Object.assign({}, edge, {ends: {src: endWithId(edge.ends.src), dst: endWithId(edge.ends.dst)}})
const toPort = node => index => ({id: portId({node, index}), node, index});
const toPorts = node => NArray(node.size).map(toPort(node.id));

const check = v => [console.log(v), v][1];

export const Node = React.Component;
export const Port = Base.End;
export const Edge = Base.Edge;
export const Graph = (Node=Node, Port=Port, Edge=Edge) => class extends PureGraph.Graph(Node, Edge) {
    componentWillMount  () { super.componentWillMount (); this.preparePorts(); }
    componentWillUpdate () { super.componentWillUpdate(); this.preparePorts(); }

    prepareGraph () {
        this.nodes = this.props.children.nodes;
        this.edges = this.props.children.edges;
    }

    preparePorts() {
        this.edges = this.edges.map(edgeWithId);
        const ports = this.nodes.map(node => ({[node.id]: toPorts(node)}));
        this.ports = Object.assign({}, ...ports);
    }

    // inherit: render ()

    renderNode (node) { return (
        <Node key={node.id} ref={node.id} {...this.makeNodeProps(node)}>
            { this.ports[node.id].map(this.renderPort.bind(this)) }
        </Node>
    ); }
    renderPort (port) { return <Port key={port.id} ref={port.id} {...this.makePortProps(port)} />; }
    // inherit: renderEdge (edge)

    // inherit: makeGraphProps ()
    makeNodeProps (node) { return { node }; }
    makePortProps (port) { return Object.assign(super.makeEndProps(port), { port }); }
    // inherit: makeEdgeProps (edge)
};

export const MovableNode = Movable(Node, {propsToPosition: props => props.node.position});
export const LinkableGraph = (Node, Port, Edge) => Linkable(Graph(Node, Port, Edge));
