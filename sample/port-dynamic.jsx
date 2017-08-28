import React from 'react';
import ReactDOM from 'react-dom';
import {polar} from './utils';
import {DynamicContainer, PortGraph, ReactUtils} from 'react-graph-diagram';

class Node extends React.Component {
    render () {
        const node = this.props.node;
        const handlers = ReactUtils.getOnEventProps(this.props, "Node", [node]);
        const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
        const position = node.dragging ? vecaddsub(node.position, node.current, node.origin) : node.position;
        const style = {left: position.x, top: position.y};
        return (
            <div draggable className="node" style={style} {...handlers}>
                {node.id}
                {this.props.children.map((child,i,a) => {
                    const {x,y} = polar(26, 2*Math.PI*(i/a.length));
                    const style = {position: 'absolute', left:`${20+x}px`, top:`${20+y}px`};
                    return <div key={i} style={style}>{child}</div>
                })}
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

class Port extends React.Component {
    render () {
        const handlers = ReactUtils.getOnEventProps(this.props, "Port", [this.props.port]);
        return <span draggable ref="point" className="port" {...handlers}/>;
    }
}

class Graph extends DynamicContainer(PortGraph(Node, Edge, Port)) {
    checkLinkedEdge (target, is) {
        return edge => !target.edges.includes(edge.id);
    }
}

console.log(new Graph({}));

const data = {
    nodes: [
        {id: "n1", position: {x:100, y:150}, size: 6},
        {id: "n2", position: {x:300, y:200}, size: 6},
        {id: "n3", position: {x:400, y:100}, size: 6},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", index:0}, {node:"n2", index:2}]},
        {id: "e2", ends: [{node:"n2", index:5}, {node:"n3", index:3}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
