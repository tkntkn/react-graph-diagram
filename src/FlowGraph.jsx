import PortGraph from './PortGraph';

const FlowGraph = function (Node, Port, Edge) {
    return class extends PortGraph(Node, Port, Edge) {};
}

FlowGraph.Node = class extends PortGraph.Node {}
FlowGraph.Edge = class extends PortGraph.Edge {}

FlowGraph.Port = class extends PortGraph.Port {
    static makeList (node, props) {
        return [
            ... Array.from(Array(node.in )).map((_,index) => ({node:node.id, flow:'in',  index})),
            ... Array.from(Array(node.out)).map((_,index) => ({node:node.id, flow:'out', index})),
        ];
    }

    static getId (port, props) {
        return `port-${port.node}-${port.flow}-${port.index}`;
    }
}

export default FlowGraph;
