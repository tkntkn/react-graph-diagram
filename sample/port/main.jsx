import React from 'react';
import ReactDOM from 'react-dom';
import {PortGraph} from 'react-graph-diagram';

class Edge extends PortGraph.Edge {
    render () {
        const [a, b] = this.props.endPositions;
        return <path className="edge" d={`M${a.x},${a.y} L${b.x},${b.y}`} />;
    }
}

class Port extends PortGraph.Port {
    render () {
        const θ = 2*Math.PI*this.props.port.index/6;
        const style = {
            top: '20px',
            left: '20px',
            transform: `translate(${26*Math.cos(θ)}px, ${26*Math.sin(θ)}px)`,
        };
        return (
            <span ref="point" className="port" style={style}/>
        )
    }
}

class Node extends PortGraph.Node {
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

const Graph = PortGraph(Node, Port, Edge);

const data = {
    nodes: [
        {id: "n1", size: 6, x: 100, y: 150},
        {id: "n2", size: 6, x: 300, y: 200},
        {id: "n3", size: 6, x: 400, y: 100},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", index:0}, {node:"n2", index:2}]},
        {id: "e2", ends: [{node:"n2", index:5}, {node:"n3", index:3}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
