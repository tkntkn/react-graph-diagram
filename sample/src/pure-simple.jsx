import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph} from 'react-graph-diagram';

const Node = class extends PureGraph.Node {
    render () {
        const [left, top] = [this.props.node.position.x, this.props.node.position.y];
        return (
            <div className="node" ref="point" style={{left, top}}>
                {this.props.node.id}
            </div>
        );
    }

    getEndPosition () {
        const rect = this.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
    }
}

const Edge = class extends PureGraph.Edge {
    render () {
        const [a, b] = [this.ends.src, this.ends.dst];
        const d = `M${a.x},${a.y} L${b.x},${b.y}`;
        return (
            <g>
                <path className="edge" d={d} />
            </g>
        );
    }
}

const Graph = PureGraph.Graph(Node, Edge);

const initData = {
    nodes: [
        {id: "n1", position: {x: 100, y: 150}},
        {id: "n2", position: {x: 300, y: 200}},
        {id: "n3", position: {x: 400, y: 100}},
    ],
    edges: [
        {id: "e1", ends: {src:{id:"n1"}, dst:{id:"n2"}}},
        {id: "e2", ends: {src:{id:"n2"}, dst:{id:"n3"}}},
    ],
}

ReactDOM.render(<Graph>{initData}</Graph>, document.getElementById("container"));
