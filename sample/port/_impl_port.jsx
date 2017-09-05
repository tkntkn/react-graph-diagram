import * as PortGraph from './port';

export const Node = class extends PortGraph.Node {
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

export const Port = class extends PortGraph.Port {
    render () {
        const {x,y} = polar(26, 2*Math.PI*(this.props.port.index/6));
        return <span ref="point" className="port"/>;
    }
}

export const Edge = class extends PortGraph.Edge {
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

export const Graph = PortGraph.Graph(Node, Port, Edge);
