import React from 'react';
import ReactDOM from 'react-dom';

const PureGraph = function (Node, Edge) {
    return class extends React.Component {
        componentDidMount () {
            this.renderEdges();
        }

        componentDidUpdate () {
            this.renderEdges();
        }

        render () {
            const divStyle = { width: "100%", height: "100%", position: "relative", };
            const svgStyle = { width: "100%", height: "100%", position: "absolute", pointerEvents: "none" };
            return (
                <div className="graph-diagram" style={divStyle}>
                    <svg ref="edges" style={svgStyle}></svg>
                    <div ref="nodes" style={divStyle}>{ Node.makeList(this.props).map(this.renderNode.bind(this)) }</div>
                </div>
            );
        }

        renderNode (node) {
            return (
                <Node key={Node.getId(node)} ref={Node.getId(node)} {...Node.getProps(node, this.props)} renderEdges={this.renderEdges.bind(this)}/>
            );
        }

        renderEdges () {
            ReactDOM.render(<g>{ Edge.makeList(this.props).map(this.renderEdge.bind(this))}</g>, this.refs["edges"]);
        }

        renderEdge (edge) {
            const endPositions = Edge.getEnds(edge).map(end => Node.getPosition(end, this.refs[Node.getId(end)], this.props));
            return <Edge key={Edge.getId(edge)} {...Edge.getProps(edge, endPositions, this.props)} />;
        }
    }
}

PureGraph.Node = class extends React.Component {
    static makeList (props) {
        return props.children.nodes;
    }

    static getId (node, props) {
        return node.id;
    }

    static getProps (node, props) {
        return Object.assign({}, props, {node});
    }

    static getPosition (node, element, props) {
        const rect = element.refs.point.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, }
    }
}

PureGraph.Edge = class extends React.Component {
    static makeList (props) {
        return props.children.edges;
    }

    static getId (edge, props) {
        return edge.id;
    }

    static getEnds (edge) {
        return edge.ends;
    }

    static getProps (edge, endPositions, props) {
        return Object.assign({}, props, {edge, endPositions});
    }
}

export default PureGraph;
