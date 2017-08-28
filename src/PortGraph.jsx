import React from 'react';
import PureGraph from './PureGraph';

const PortGraph = function (Node, Port, Edge) {
    return class extends PureGraph(Node, Edge) {
        renderNode (node) {
            return (
                <Node key={Node.getId(node)} {...Node.getProps(node, this.props)} renderEdges={this.renderEdges.bind(this)}>
                    { Port.makeList(node, this.props).map(this.renderPort.bind(this)) }
                </Node>
            );
        }

        renderPort (port) {
            return (
                <Port key={Port.getId(port)} ref={Port.getId(port)} {...Port.getProps(port, this.props)} />
            );
        }

        renderEdge (edge) {
            const endPositions = Edge.getEnds(edge).map(end => Port.getPosition(end, this.refs[Port.getId(end)], this.props));
            return <Edge key={Edge.getId(edge)} {...Edge.getProps(edge, endPositions, this.props)} />;
        }
    };
}

PortGraph.Node = class extends PureGraph.Node {}
PortGraph.Edge = class extends PureGraph.Edge {}

PortGraph.Port = class extends React.Component {
    static makeList (node, props) {
        return Array.from(Array(node.size)).map((_,index) => ({node:node.id, index}));
    }

    static getId (port, props) {
        return `port-${port.node}-${port.index}`;
    }

    static getProps (port, props) {
        return Object.assign({}, props, {port});
    }

    static getPosition (port, element, props) {
        const rect = element.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, }
    }
}

export default PortGraph;
