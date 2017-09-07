// import React from 'react';
// import * as Base from './base';
// import * as PortGraph from './port';
// import {NArray} from './Utils';

// const portId = port => port.id || `port-${port.node}-${port.flow}-${port.index}`;
// const endWithId  = end  => Object.assign({}, end,  {id: portId(end)})
// const edgeWithId = edge => Object.assign({}, edge, {ends: edge.ends.map(assignIdToEnd)})
// const toPort = node => flow => index => ({id:portId({node, flow, index}), node, flow, index})
// const toPorts = node => [
//     ...NArray(node.in ).map(toPort('in' )(node.id)),
//     ...NArray(node.out).map(toPort('out')(node.id)),
// ];

// export const Node = React.Component;
// export const Port = Base.End;
// export const Edge = Base.Edge;
// export const Graph = (Node=Node, Port=Port, Edge=Edge) => class extends PortGraph.Graph(Node, Edge) {
//     // inherit: componentWillMount ()
//     // inherit: componentWillUpdate ()

//     prepareGraph () {
//         this.nodes = this.props.children.nodes;
//         this.edges = this.props.children.edges.map(assignIdToEdge);
//         const ports = this.nodes.map(node => ({[node.id]: toPorts(node)}));
//         this.ports = Object.assign({}, ports);
//     }

//     // inherit: render ()

//     // inherit: renderNode (node)
//     // inherit: renderPort (port)
//     // inherit: renderEdge (edge)

//     // inherit: makeGraphProps ()
//     // inherit makeNodeProps (node)
//     // inherit makePortProps (port)
//     // inherit: makeEdgeProps (edge)
// }

// export default FlowGraph;






// import React from 'react';
// import {PortGraph} from './PortGraph';

// const FlowGraph = function (Node, Port, Edge) {
//     return class extends PortGraph(Node, Port, Edge) {};
// }

// FlowGraph.Node = class extends React.Component {}
// FlowGraph.Edge = class extends React.Component {}

// FlowGraph.Port = class extends React.Component {
//     static makeList (node, props) {
//         return [
//             ... Array.from(Array(node.in )).map((_,index) => ({node:node.id, flow:'in',  index})),
//             ... Array.from(Array(node.out)).map((_,index) => ({node:node.id, flow:'out', index})),
//         ];
//     }

//     static getId (port, props) {
//         return `port-${port.node}-${port.flow}-${port.index}`;
//     }
// }

// export default FlowGraph;
