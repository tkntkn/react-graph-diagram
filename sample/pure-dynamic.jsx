import React from 'react';
import ReactDOM from 'react-dom';
import {DynamicContainer, DynamicGraph, PureGraph, ReactUtils} from 'react-graph-diagram';

class Node extends React.Component {
    render () {
        const handlers = ReactUtils.getOnEventProps(this.props, "Node", [this.props.node]);
        const style = {left: this.props.node.position.x, top: this.props.node.position.y};
        return (
            <div draggable className="node" ref="point" style={style} {...handlers}>
                {this.props.node.id}
            </div>
        );
    }
}

class Edge extends React.Component {
    render () {
        const handlers = ReactUtils.getOnEventProps(this.props, "Edge", [this.props.edge]);
        const [a, b] = this.props.edge.ends.map(end => end.position);
        return (
            <g>
                <path className="edge" d={`M${a.x},${a.y} L${b.x},${b.y}`} />
                <path className="edge-wrapper" d={`M${a.x},${a.y} L${b.x},${b.y}`} {...handlers} />
            </g>
        );
    }
}

const Graph = DynamicGraph(PureGraph(Node, Edge));
const GraphContainer = DynamicContainer(Graph);

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

ReactDOM.render(<GraphContainer>{data}</GraphContainer>, document.getElementById("container"));
