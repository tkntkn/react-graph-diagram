import FlowGraph from './FlowGraph';

const EditGraph = function (Node, Port, Edge) {
    return class extends FlowGraph(Node, Port, Edge) {};
}

EditGraph.Node = class extends FlowGraph.Node {}
EditGraph.Edge = class extends FlowGraph.Edge {}

EditGraph.Port = class extends FlowGraph.Port {
    static getId (port, props) {
        return port.id || super.getId(port, props);
    }

    static makeList (node, props) {
        if (EditGraph.Node.getId(node) === POINTER_NODE_ID) return [];
        return super.makeList(node, props);
    }

    static getPosition (port, element, props) {
        if (EditGraph.Port.getId(port) === POINTER_PORT_ID) return port.position;
        return super.getPosition(port, element, props);
    }
}

export default EditGraph;
export const POINTER_NODE_ID = "react-graph-diagram-POINTER_NODE_ID";
export const POINTER_PORT_ID = "react-graph-diagram-POINTER_PORT";
