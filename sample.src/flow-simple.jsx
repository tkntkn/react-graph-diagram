import React from 'react';
import ReactDOM from 'react-dom';
import {FlowGraph} from 'react-graph-diagram';

class Node extends FlowGraph.Node {
    render () {
        const [left, top] = [this.props.node.position.x, this.props.node.position.y];
        const inlets  = this.props.children.filter(child => child.props.port.flow === 'in');
        const outlets = this.props.children.filter(child => child.props.port.flow === 'out');
        return (
            <div className="node" ref="point" style={{left, top}}>
                {this.props.node.id}
                <div className="ports in">{inlets}</div>
                <div className="ports out">{outlets}</div>
            </div>
        );
    }
}

class Port extends FlowGraph.Port {
    render () {
        const className = `port ${this.props.port.flow}`;
        return <span ref="point" className={className} />
    }

    getEndPosition () {
        const rect = this.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
    }
}

class Edge extends FlowGraph.Edge {
    render () {
        const [a, b] = [this.ends.src, this.ends.dst];
        const diff = Math.abs(a.y - b.y);
        const p1 = `${a.x},${a.y}`;
        const p2 = `${a.x},${a.y + diff + 30}`;
        const p3 = `${b.x},${b.y - diff - 30}`;
        const p4 = `${b.x},${b.y}`;
        const d = `M${p1} C${p2} ${p3} ${p4}`;
        return (
            <g>
                <path className="edge" d={d} />
            </g>
        );
    }
}

const Graph = FlowGraph.Graph(Node, Port, Edge);

import {FlowGraphSample as initData} from './sample';
ReactDOM.render(<Graph>{initData}</Graph>, document.getElementById("container"));
