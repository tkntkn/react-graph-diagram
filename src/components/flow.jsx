import React from 'react';
import * as Base from './base';
import * as PortGraph from './port';
import {NArray} from './Utils';

const portId = port => port.id || `port-${port.node}-${port.flow}-${port.index}`;
const endWithId  = end  => Object.assign({}, end,  {id: portId(end)})
const edgeWithId = edge => Object.assign({}, edge, {ends: edge.ends.map(assignIdToEnd)})
const toPort = node => flow => index => ({id:portId({node, flow, index}), node, flow, index})
const toPorts = node => [
    ...NArray(node.in ).map(toPort('in' )(node.id)),
    ...NArray(node.out).map(toPort('out')(node.id)),
];

export const Node = React.Component;
export const Port = Base.End;
export const Edge = Base.Edge;
export const Graph = (Node=Node, Port=Port, Edge=Edge) => class extends PortGraph.Graph(Node, Edge) {
    // inherit: componentWillMount ()
    // inherit: componentWillUpdate ()

    prepareGraph () {
        this.nodes = this.props.children.nodes;
        this.edges = this.props.children.edges.map(assignIdToEdge);
        const ports = this.nodes.map(node => ({[node.id]: toPorts(node)}));
        this.ports = Object.assign({}, ports);
    }

    // inherit: render ()

    // inherit: renderNode (node)
    // inherit: renderPort (port)
    // inherit: renderEdge (edge)

    // inherit: makeGraphProps ()
    // inherit makeNodeProps (node)
    // inherit makePortProps (port)
    // inherit: makeEdgeProps (edge)
}

export default FlowGraph;
