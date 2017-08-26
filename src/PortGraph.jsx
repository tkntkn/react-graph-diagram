import React from 'react';
import PureGraph from './PureGraph';

const PortGraph = function (Node, Port, Edge) {
    return class extends PureGraph(Node, Edge) {
        renderNode (node) {
            return (
                <Node key={Node.key(node)} {...Node.toProps(node, this.props)}>
                    { Port.getList(node, this.props).map(this.renderPort.bind(this)) }
                </Node>
            );
        }

        renderPort (port) {
            return (
                <Port key={Port.key(port)} ref={Port.key(port)} {...Port.toProps(port, this.props)} />
            );
        }

        renderEdge (edge) {
            const endPositions = Edge.ends(edge).map(port => Port.getPosition(port, this.refs[Port.key(port)], this.props));
            return <Edge key={Edge.key(edge)} {...Edge.toProps(edge, endPositions, this.props)} />;
        }
    };
}

PortGraph.Node = class extends PureGraph.Node {}
PortGraph.Edge = class extends PureGraph.Edge {}

PortGraph.Port = class extends React.Component {
    static key (port, props) {
        return `port-${PortGraph.Node.key(port.node)}.${port.index}`;
    }

    static getList (node, props) {
        return Array.from(Array(node.size)).map((_,index) => ({node, index}));
    }

    static toProps (port, props) {
        return Object.assign({}, props, {port});
    }

    static getPosition (port, element, props) {
        const rect = element.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, }
    }
}

export default PortGraph;
