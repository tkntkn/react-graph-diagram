import React from 'react';
import * as Base from './base';
import * as PortGraph from './port';
import {Movable} from '../extensions/movable';
import {Linkable} from '../extensions/linkable';
import {NArray} from '../utils';

const portId = port => port.id || `port-${port.node}-${port.flow}-${port.index}`;
const endWithId  = end  => Object.assign({}, end,  {id: portId(end)});
const edgeWithId = edge => Object.assign({}, edge, {ends: {src: endWithId(edge.ends.src), dst: endWithId(edge.ends.dst)}});
const toPort = node => flow => index => ({id:portId({node, flow, index}), node, flow, index})
const toPorts = node => [
    ...NArray(node.size.in ).map(toPort(node.id)('in')),
    ...NArray(node.size.out).map(toPort(node.id)('out')),
];

export const Node = React.Component;
export const Port = Base.End;
export const Edge = Base.Edge;
export const Graph = (Node=Node, Port=Port, Edge=Edge) => class extends PortGraph.Graph(Node, Port, Edge) {
    // inherit: componentWillMount ()
    // inherit: componentWillUpdate ()

    // prepareGraph ()

    preparePorts() {
        this.edges = this.edges.map(edgeWithId);
        const ports = this.nodes.map(node => ({[node.id]: toPorts(node)}));
        this.ports = Object.assign({}, ...ports);
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

export const MovableNode = Movable(Node, {propsToPosition: props => props.node.position});
export const LinkableGraph = (Node, Port, Edge) => Linkable(Graph(Node, Port, Edge));
