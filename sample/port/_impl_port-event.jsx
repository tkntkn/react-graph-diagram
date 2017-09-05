import * as PortEventGraph from './port-event';
import {getOnEventProps} from './ReactUtils';

export const Node = class extends PortEventGraph.Node {
    render () {
        const handlers = getOnEventProps(this.props, "Node", [this.props.node]);
        const [left, top] = [this.props.node.position.x, this.props.node.position.y];
        return (
            <div draggable className="node" ref="point" style={{left, top}} {...handlers}>
                {this.props.node.id}
            </div>
        );
    }

    getEndPosition () {
        const rect = this.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
    }
}

export const Port = class extends PortEventGraph.Port {
    render () {
        const handlers = getOnEventProps(this.props, "Port", [this.props.port]);
        const {x,y} = polar(26, 2*Math.PI*(this.props.port.index/6));
        return <span ref="point" className="port" {...handlers} />;
    }
}

export const Edge = class extends PortEventGraph.Edge {
    render () {
        const handlers = getOnEventProps(this.props, "Edge", [this.props.edge]);
        const [a, b] = [this.ends.src, this.ends.dst];
        const d = `M${a.x},${a.y} L${b.x},${b.y}`;
        return (
            <g>
                <path className="edge" d={d} />
                <path className="edge-wrapper" d={d} {...handlers} />
            </g>
        );
    }
}

export const Graph = PortEventGraph.Graph(Node, Port, Edge);
