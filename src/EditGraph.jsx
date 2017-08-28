import FlowGraph from './FlowGraph';

const EditGraph = function (Node, Port, Edge) {
    return class extends FlowGraph(Node, Port, Edge) {};
}

EditGraph.Node = class extends FlowGraph.Node {}
EditGraph.Edge = class extends FlowGraph.Edge {}

EditGraph.Port = class extends FlowGraph.Port {
    static getId (port, props) {
        return (port.id === FREE_PORT_ID) ? port.id : super.getId(port, props);
    }

    static getPosition (port, element, props) {
        if (EditGraph.Port.getId(port) === FREE_PORT_ID) return port.position;
        return super.getPosition(port, element, props);
    }
}

export default EditGraph;
export const FREE_PORT_ID = "react-graph-diagram-FREE_PORT";
