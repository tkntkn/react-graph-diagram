import React from 'react';
import ReactDOM from 'react-dom';
import {FlowGraph} from 'react-graph-diagram';

class Edge extends FlowGraph.Edge {
    render () {
        const [a, b] = this.props.endPositions;

        const diff = Math.abs(a.x - b.x) / 1.5;
        const p1 = `${a.x},${a.y}`;
        const p2 = `${a.x},${a.y - diff}`;
        const p3 = `${b.x},${b.y + diff}`;
        const p4 = `${b.x},${b.y}`;

        const className = `edge`;
        return <path className="edge" d={`M${p1} C${p2} ${p3} ${p4}`} />
    }
}

class Port extends FlowGraph.Port {
    render () {
        const p = (this.props.port.index+1)/(this.props.port.node[this.props.port.flow]+1);
        const style = { left: `${p*53 - (3 + 2 * 3 + 4) / 2 }px` };
        const className = `port ${this.props.port.flow}`;
        return (
            <span ref="point" className={className} style={style}/>
        )
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
        {id: "1", in: 3, out: 3, x: 100, y: 150},
        {id: "2", in: 3, out: 3, x: 300, y: 200},
        {id: "3", in: 3, out: 3, x: 400, y: 100},
    ],
    edges: [
        {id: "1", src: {node: {id: "1"}, index: 0}, dst: {node: {id: "2"}, index: 1}},
        {id: "2", src: {node: {id: "2"}, index: 2}, dst: {node: {id: "3"}, index: 2}},
    ],
};

ReactDOM.render(<Graph {...data} />, document.getElementById("container"));
