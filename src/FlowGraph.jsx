import PortGraph from './PortGraph';

const FlowGraph = function (Node, Port, Edge) {
    return class extends PortGraph(Node, Port, Edge) {};
}

FlowGraph.Node = class extends PortGraph.Node {}
FlowGraph.Edge = class extends PortGraph.Edge {
    static ends (edge) {
        const src = Object.assign({flow: 'in' }, edge.src);
        const dst = Object.assign({flow: 'out'}, edge.dst);
        return [src, dst];
    }
}

FlowGraph.Port = class extends PortGraph.Port {
    static key (port, props) {
        return `port-${FlowGraph.Node.key(port.node)}-${port.flow}-${port.index}`;
    }

    static getList (node, props) {
        const ins  = Array.from(Array(node.in )).map((_,index) => ({node, index, flow: 'in'}));
        const outs = Array.from(Array(node.out)).map((_,index) => ({node, index, flow: 'out'}));
        return [...ins, ...outs];
    }
}

export default FlowGraph;
