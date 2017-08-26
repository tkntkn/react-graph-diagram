import React from 'react';
import ReactDOM from 'react-dom';

const PureGraph = function (Node, Edge) {
    return class extends React.Component {
        componentDidMount () {
            ReactDOM.render(this.renderEdges(), this.refs["edges"]);
        }

        componentDidUpdate () {
            ReactDOM.render(this.renderEdges(), this.refs["edges"]);
        }

        render () {
            const rootStyle = { width: "100%", height: "100%", position: "relative", };
            const svgStyle  = { width: "100%", height: "100%", position: "absolute", pointerEvents: "none" };
            return (
                <div className="graph-diagram" style={rootStyle}>
                    <svg ref="edges" style={svgStyle}></svg>
                    <div ref="nodes">{ Node.getList(this.props).map(this.renderNode.bind(this)) }</div>
                </div>
            );
        }

        renderNode (node) {
            return (
                <Node key={Node.key(node)} ref={Node.key(node)} {...Node.toProps(node, this.props)} />
            );
        }

        renderEdges () {
            return <g>{ Edge.getList(this.props).map(this.renderEdge.bind(this))}</g>;
        }

        renderEdge (edge) {
            const endPositions = Edge.ends(edge).map(node => Node.getPosition(node, this.refs[Node.key(node)], this.props));
            return <Edge key={Edge.key(edge)} {...Edge.toProps(edge, endPositions, this.props)} />;
        }
    }
}

PureGraph.Node = class extends React.Component {
    static key (node, props) {
        return `node-${node.id}`;
    }

    static getList (props) {
        return props.children.nodes;
    }

    static toProps (node, props) {
        return Object.assign({}, props, {node});
    }

    static getPosition (node, element, props) {
        const rect = element.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, }
    }
}

PureGraph.Edge = class extends React.Component {
    static key (edge, props) {
        return `edge-${edge.id}`;
    }

    static ends (edge) {
        return edge.ends;
    }

    static getList (props) {
        return props.children.edges;
    }

    static toProps (edge, endPositions, props) {
        return Object.assign({}, props, {edge, endPositions});
    }
}

export default PureGraph;
