import React from 'react';
import ReactDOM from 'react-dom';
import {PortGraph} from 'react-graph-diagram';
import {polar} from './utils';

class Node extends PortGraph.Node {
    render () {
        const [left, top] = [this.props.node.position.x, this.props.node.position.y];
        return (
            <div className="node" ref="point" style={{left, top}}>
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

class Port extends PortGraph.Port {
    render () {
        return <span ref="point" className="port"/>;
    }

    getEndPosition () {
        const rect = this.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
    }
}

class Edge extends PortGraph.Edge {
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

const Graph = PortGraph.Graph(Node, Port, Edge);

import {PortGraphSample as initData} from './sample';
ReactDOM.render(<Graph>{initData}</Graph>, document.getElementById("container"));
