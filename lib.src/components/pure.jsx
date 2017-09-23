import React from 'react';
import * as Base from './base';
import {Movable} from '../extensions/movable';
import {Linkable} from '../extensions/linkable';

export const Node = Base.End;
export const Edge = Base.Edge;
export const Graph = (Node=Node, Edge=Edge) => class extends Base.Graph {
    componentWillMount (nextProps, nextState) { this.prepareGraph(nextProps, nextState); }
    componentWillUpdate(nextProps, nextState) { this.prepareGraph(nextProps, nextState); }

    prepareGraph (props, state) {
        this.nodes = props.children.nodes;
        this.edges = props.children.edges;
    }

    render () {
        const style = { width: "100%", height: "100%", position: "absolute" };
        return (
            <div className="graph-diagram" {...this.makeGraphProps()}>
                <svg className="edges" ref="edges" style={style}>{ this.edges.map(this.renderEdge.bind(this)) }</svg>
                <div className="nodes" ref="nodes" style={style}>{ this.nodes.map(this.renderNode.bind(this)) }</div>
            </div>
        );
    }

    renderNode (node) { return <Node key={node.id} ref={node.id} {...this.makeNodeProps(node)} />; }
    renderEdge (edge) { return <Edge key={edge.id} ref={edge.id} {...this.makeEdgeProps(edge)} />; }

    makeGraphProps () { return { style: { width: "100%", height: "100%", position: "absolute" } }; }
    makeNodeProps (node) { return Object.assign(super.makeEndProps(node), { node }); }
    makeEdgeProps (edge) { return { edge }; }
};

export const MovableNode = Movable(Node, {propsToPosition: props => props.node.position});
export const LinkableGraph = (Node,Edge) => Linkable(Graph(Node,Edge));
