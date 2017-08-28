import React from 'react';
import ReactDOM from 'react-dom';
import {FlowGraph} from 'react-graph-diagram';

class Edge extends FlowGraph.Edge {
    render () {
        const [a, b] = this.props.endPositions;

        const diff = Math.abs(a.y - b.y);
        const p1 = `${a.x},${a.y}`;
        const p2 = `${a.x},${a.y + diff + 30}`;
        const p3 = `${b.x},${b.y - diff - 30}`;
        const p4 = `${b.x},${b.y}`;

        const className = `edge`;
        return <path className="edge" d={`M${p1} C${p2} ${p3} ${p4}`} />
    }
}

class Port extends FlowGraph.Port {
    render () {
        const port = this.props.port;
        const style = { left: `${this.props.r*53 - (3 + 2 * 3 + 4) / 2 }px` };
        const className = `port ${port.flow}`;
        return <span ref="point" className={className} style={style}/>
    }

    static getProps (port, props) {
        const node = props.children.nodes.find(node => node.id === port.node);
        const r = (port.index+1)/(node[port.flow]+1);
        return Object.assign(super.getProps(port, props), {r})
    }
}

class Node extends FlowGraph.Node {
    render () {
        const style = {left: this.props.node.x, top: this.props.node.y};
        return (
            <div className="node" style={style}>
                {this.props.node.id}
                {this.props.children}
            </div>
        );
    }
}

const Graph = FlowGraph(Node, Port, Edge);

const data = {
    nodes: [
        {id: "n1", in: 3, out: 3, x: 100, y: 150},
        {id: "n2", in: 3, out: 3, x: 300, y: 200},
        {id: "n3", in: 3, out: 3, x: 400, y: 100},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", flow:'out', index:0}, {node:"n2", flow:'in', index:1}]},
        {id: "e2", ends: [{node:"n2", flow:'out', index:2}, {node:"n3", flow:'in', index:0}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
