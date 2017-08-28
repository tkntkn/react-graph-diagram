import React from 'react';
import ReactDOM from 'react-dom';
import {PureGraph, pointer} from 'react-graph-diagram';
import * as RGD from 'react-graph-diagram';

class Edge extends React.Component {
    render () {
        const [a, b] = this.props.edge.ends.map(end => end.position);
        return (
            <g>
                <path className="edge" d={`M${a.x},${a.y} L${b.x},${b.y}`} />
            </g>
        );
    }
}

class Node extends React.Component {
    render () {
        const style = {left: this.props.node.position.x, top: this.props.node.position.y};
        return (
            <div className="node" ref="point" style={style}>
                {this.props.node.id}
            </div>
        );
    }
}

const Graph = PureGraph(Node, Edge);

const data = {
    nodes: [
        {id: "n1", position: {x: 100, y: 150}},
        {id: "n2", position: {x: 300, y: 200}},
        {id: "n3", position: {x: 400, y: 100}},
    ],
    edges: [
        {id: "e1", ends: [{id:"n1"}, {id:"n2"}]},
        {id: "e2", ends: [{id:"n2"}, {id:"n3"}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
