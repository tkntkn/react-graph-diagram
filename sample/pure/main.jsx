import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph} from 'react-graph-diagram';

class Edge extends PureGraph.Edge {
    render () {
        const [a, b] = this.props.endPositions;
        return <path className="edge" d={`M${a.x},${a.y} L${b.x},${b.y}`} />;
    }
}

class Node extends PureGraph.Node {
    render () {
        const style = {left: this.props.node.x, top: this.props.node.y};
        return <div className="node" ref="point" style={style}>{this.props.node.id}</div>;
    }
}

const Graph = PureGraph(Node, Edge);

const data = {
    nodes: [
        {id: "n1", x: 100, y: 150},
        {id: "n2", x: 300, y: 200},
        {id: "n3", x: 400, y: 100},
    ],
    edges: [
        {id: "e1", ends: [{id:"n1"}, {id:"n2"}]},
        {id: "e2", ends: [{id:"n2"}, {id:"n3"}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
