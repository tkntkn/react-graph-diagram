import React from 'react';
import ReactDOM from 'react-dom';
import {polar} from './utils';
import {PortGraph} from 'react-graph-diagram';

class Node extends React.Component {
    render () {
        const style = {left: this.props.node.position.x, top: this.props.node.position.y};
        return (
            <div className="node" style={style}>
                {this.props.node.id}
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
        const [a, b] = this.props.edge.ends.map(end => end.position);
        return <path className="edge" d={`M${a.x},${a.y} L${b.x},${b.y}`} />;
    }
}

class Port extends React.Component {
    render () {
        const {x,y} = polar(26, 2*Math.PI*(this.props.port.index/6));
        return <span ref="point" className="port"/>;
    }
}

const Graph = PortGraph(Node, Edge, Port);

const data = {
    nodes: [
        {id: "n1", size: 6, position: {x: 100, y: 150}},
        {id: "n2", size: 6, position: {x: 300, y: 200}},
        {id: "n3", size: 6, position: {x: 400, y: 100}},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", index:0}, {node:"n2", index:2}]},
        {id: "e2", ends: [{node:"n2", index:5}, {node:"n3", index:3}]},
    ],
};

ReactDOM.render(<Graph>{data}</Graph>, document.getElementById("container"));
