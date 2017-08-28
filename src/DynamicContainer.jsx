import React from 'react';
import {PureGraph} from './PureGraph'

export const POINTER_END_ID = "react-graph-diagram::POINTER_END_ID";
export const makePointerEnd = position => ({id:POINTER_END_ID, position});
export const updateEndPointerEnd  = position => end  => end.id === POINTER_END_ID ? makePointerEnd(position) : end
export const updateEndsPointerEnd = position => ends => ends.map(updateEndPointerEnd(position));
export const updateEdgePointerEnd = position => edge => Object.assign({}, edge, {ends:updateEndsPointerEnd(position)(edge.ends)});
export const checkPointerEnd  = is => end  => end.id===POINTER_END_ID ? is : !is;
export const checkPointerEdge = is => edge => edge.ends.every(checkPointerEnd(is));
export const getOnEventMethods = self => {
    const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(self)).filter(name => name.startsWith("on"));
    return Object.assign({}, ...handlerNames.map(name => ({[name]: self[name].bind(self)}) ));
}
export const getOnEventProps = (props, keyword="", args) => {
    const handlerNames = Object.getOwnPropertyNames(props).filter(name => name.startsWith(`on${keyword}`));
    return args
        ? Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,"")]: props[name](...args)}) ))
        : Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,"")]: props[name]}) ));
}
export const dummyImage = document.createElement('img'); dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const ID = (function () {let i = 1; return () => `ID${i++}`;})();
export const pointer = event => ({x:event.clientX, y:event.clientY})

export const DynamicPureGraph = function (Node, Edge) {
    return class extends PureGraph(Node, Edge) {
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

        calcEndPosition (end) {
            if (end.id === POINTER_END_ID) return end.position;
            const rect = this.refs[end.id].refs.point.getBoundingClientRect();
            return { x: rect.left + rect.width/2, y: rect.top + rect.height/2, };
        }
    }
}

export const DynamicContainer = Graph => class extends React.Component {
    constructor (props) {
        super(props);
        this.state = props.children;
        this.doubleClickStopPropagate = false;
    }

    onGraphDoubleClick (target) {
        return event => {
            if (this.doubleClickStopPropagate) {
                this.doubleClickStopPropagate = false;
                return;
            }
            const newNode = {id:ID(), position:pointer(event)};
            this.setState({
                nodes: this.state.nodes.concat(newNode),
            }, this.forceUpdate.bind(this));
        }
    }

    onEdgeDoubleClick (target) {
        return event => {
            event.stopPropagation();
            this.doubleClickStopPropagate = true;
            this.setState({
                edges: this.state.edges.filter(edge => edge.id!==target.id)
            }, this.forceUpdate.bind(this));
            return false;
        }
    }

    onNodeDoubleClick (target) {
        return event => {
            event.stopPropagation();
            this.setState({
                nodes: this.state.nodes.filter(node => node.id!==target.id),
                edges: this.state.edges.filter(edge => edge.ends.every(end => end.id!==target.id))
            }, this.forceUpdate.bind(this));
        }
    }

    onNodeDragStart (target) {
        return event => {
            event.stopPropagation();
            event.dataTransfer.setDragImage(dummyImage, 0, 0);
            event.dataTransfer.setData('nodeDrag', JSON.stringify(target));
            const newEdge = {id:ID(), ends:[target, makePointerEnd(pointer(event))]};
            this.setState({
                edges: this.state.edges.concat(newEdge)
            });
        }
    }

    onNodeDrag (target) {
        return event => {
            if (pointer(event).x === 0 && pointer(event).y === 0) return;
            this.setState({
                edges: this.state.edges.map(updateEdgePointerEnd(pointer(event)))
            });
        }
    }

    onNodeDragEnd (taget) {
        return event => {
            this.setState({
                nodes: this.state.nodes.filter(checkPointerEnd(false)),
                edges: this.state.edges.filter(checkPointerEdge(false))
            }, this.forceUpdate.bind(this));
        }
    }

    onNodeDragEnter (target) {
        return event => {
            event.preventDefault();
        }
    }

    onNodeDragOver (target) {
        return event => {
            event.preventDefault();
        }
    }

    onNodeDrop (target) {
        return event => {
            event.preventDefault();
            const origin = JSON.parse(event.dataTransfer.getData('nodeDrag') || "false");
            if (!origin) return;
            this.setState({
                edges: this.state.edges.concat({id: ID(), ends: [target, origin]})
            });
        }
    }

    render () {
        const handlers = getOnEventMethods(this);
        return <Graph {...handlers}>{this.state}</Graph>;
    }
}

PureGraph.Node = class extends React.Component {};
PureGraph.Edge = class extends React.Component {};
