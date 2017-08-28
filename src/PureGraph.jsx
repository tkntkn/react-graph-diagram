import React from 'react';
import ReactDOM from 'react-dom';
import {getOnEventMethods, getOnEventProps} from './ReactUtils';

export const PureGraph = function (Node, Edge) {
    return class extends React.Component {
        componentWillMount  () { if (!this.props.keepGraph) this.prepareGraph(); }
        componentWillUpdate () { if (!this.props.keepGraph) this.prepareGraph(); }
        componentDidMount   () { this.renderEdges(); }
        componentDidUpdate  () { this.renderEdges(); }
        mapNodeToProps (node) { return Object.assign(this.nodeEventHandlers, {node, renderEdges: this.renderEdges}); }
        mapEdgeToProps (edge) { return Object.assign(this.edgeEventHandlers, {edge}); }
        assignPositionToEnd  (end)  { return Object.assign({}, end,  {position: this.calcEndPosition(end)}); }
        assignPositionToEdge (edge) { return Object.assign({}, edge, {ends: edge.ends.map(this.assignPositionToEnd.bind(this))}); }

        render () {
            const handlers = getOnEventProps(this.props, "Graph", [this]);
            const style = { width: "100%", height: "100%", position: "absolute" };
            return (
                <div className="graph-diagram" style={style} {...handlers}>
                    <svg className="edges" ref="edges" style={style}></svg>
                    <div className="nodes" ref="nodes" style={style}>{ this.nodes.map(this.renderNode.bind(this)) }</div>
                </div>
            );
        }

        renderEdges () {
            this.edges = this.edges.map(this.assignPositionToEdge.bind(this));
            ReactDOM.render( <g>{this.edges.map(this.renderEdge.bind(this))}</g>, this.refs["edges"]);
        }

        renderNode (node) {
            return <Node key={node.id} ref={node.id} {...this.mapNodeToProps(node)} />;
        }

        renderEdge (edge) {
            return <Edge key={edge.id} {...this.mapEdgeToProps(edge)} />;
        }

        prepareGraph () {
            this.nodes = this.props.children.nodes;
            this.edges = this.props.children.edges;
            this.nodeEventHandlers = getOnEventProps(this.props, "Node", null, false);
            this.edgeEventHandlers = getOnEventProps(this.props, "Edge", null, false);
        }

        calcEndPosition (end) {
            const rect = this.refs[end.id].refs.point.getBoundingClientRect();
            return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
        }
    }
}

PureGraph.Node = class extends React.Component {};
PureGraph.Edge = class extends React.Component {};
