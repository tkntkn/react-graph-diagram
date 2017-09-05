import React from 'react';
import * as Base from './base';
import * as PureGraph from './pure';
import {NArray} from './Utils';

const portId = port => port.id || `port-${port.node}-${port.index}`;
const endWithId  = end  => Object.assign({}, end,  {id: portId(end)})
const edgeWithId = edge => Object.assign({}, edge, {ends: edge.ends.map(assignIdToEnd)})
const toPort = node => index => ({id: portId({node, index}), node, index});
const toPorts = node => NArray(node.size).map(toPort(node.id));

export const Node = React.Component;
export const Port = Base.End;
export const Edge = Base.Edge;
export const Graph = (Node=Node, Port=Port, Edge=Edge) => class extends PureGraph.Graph(Node, Edge) {
    // inherit: componentWillMount ()
    // inherit: componentWillUpdate ()

    prepareGraph () {
        this.nodes = this.props.children.nodes;
        this.edges = this.props.children.edges.map(edgeWithId);
        const ports = this.nodes.map(node => ({[node.id]: toPorts(node)}));
        this.ports = Object.assign({}, ports);
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
