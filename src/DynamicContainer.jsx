import React from 'react';
import {PureGraph} from './PureGraph'
import {getOnEventMethods, getOnEventProps} from './ReactUtils';
import {dummyImage, ID, pointer, objectMap} from './Utils';

export const POINTER_END_ID = "react-graph-diagram::POINTER_END_ID";
export const makePointerEnd = position => ({id:POINTER_END_ID, position});
export const updateEndPointerEnd  = position => end  => end.id === POINTER_END_ID ? makePointerEnd(position) : end
export const updateEndsPointerEnd = position => ends => ends.map(updateEndPointerEnd(position));
export const updateEdgePointerEnd = position => edge => Object.assign({}, edge, {ends:updateEndsPointerEnd(position)(edge.ends)});
export const checkPointerEnd  = is => end  => end.id===POINTER_END_ID ? is : !is;
export const checkPointerEdge = is => edge => edge.ends.every(checkPointerEnd(is));

export const DynamicGraph = function (Graph) {
    return class extends Graph {
        calcEndPosition (end) {
            if (end.id === POINTER_END_ID) return end.position;
            return super.calcEndPosition(end);
        }
    }
}

export const DynamicContainer = Graph => class extends React.Component {
/*
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
*/
}

export const DynamicContainer2 = Graph => class extends React.Component {
    constructor (props) {
        super(props);
        this.state = props.children;
        this.doubleClickStopPropagate = false;
    }

    componentWillReceiveProps () {
    }

    makeNewNode (position, size) {
        return {id:ID(), position, size}
    }

    makeEdge (end1, end2) {
        return {id:ID(), ends: [end1, end2]};
    }

    makePointerEdge (position, end) {
        return this.makeEdge({id:POINTER_END_ID, position}, end);
    }

    assignToTarget (target, data) {
        return compare => compare.id === target.id ? Object.assign(compare, data): compare;
    }

    onGraphDoubleClick (target, event) {
        if (this.doubleClickStopPropagate) { this.doubleClickStopPropagate = false; return; }
        this.setState({
            nodes: this.state.nodes.concat(this.makeNewNode(pointer(event), Math.floor(Math.random() * 10 + 1))),
        }, this.forceUpdate.bind(this));
    }

    onNodeDragStart (target, event) {
        event.dataTransfer.setDragImage(dummyImage, 0, 0);
        const dragState = {dragging:true, current:pointer(event), origin:pointer(event)};
        this.setState({
            nodes: this.state.nodes.map(this.assignToTarget(target, dragState))
        });
    }

    onNodeDrag (target, event) {
        if (pointer(event).x === 0 && pointer(event).y === 0) return;
        const dragState = {current:pointer(event)};
        this.setState({
            nodes: this.state.nodes.map(this.assignToTarget(target, dragState))
        })
    }

    onNodeDragEnd (target, event) {
        const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
        const dragState = {dragging:false, position: vecaddsub(target.position, pointer(event), target.origin)};
        this.setState({
            nodes: this.state.nodes.map(this.assignToTarget(target, dragState))
        })
    }

    onNodeDoubleClick (target, event) {
        this.setState({
            nodes: this.state.nodes.filter(node => node.id!==target.id),
            edges: this.state.edges.filter(edge => !target.edges.includes(edge.id))
        }, this.forceUpdate.bind(this));
    }

    onEdgeDoubleClick (target, event) {
        event.stopPropagation();
        this.doubleClickStopPropagate = true;
        this.setState({
            edges: this.state.edges.filter(edge => edge.id!==target.id)
        }, this.forceUpdate.bind(this));
    }

    onEndDragStart (target, event) {
        event.stopPropagation();
        event.dataTransfer.setDragImage(dummyImage, 0, 0);
        event.dataTransfer.setData('endDrag', JSON.stringify(target));
        this.setState({
            edges: this.state.edges.concat(this.makePointerEdge(pointer(event), target))
        });
    }

    onEndDrag (target, event) {
        event.stopPropagation();
        if (pointer(event).x === 0 && pointer(event).y === 0) return;
        this.setState({
            edges: this.state.edges.map(updateEdgePointerEnd(pointer(event)))
        });
    }

    onEndDragEnd (target, event) {
        event.stopPropagation();
        this.setState({
            edges: this.state.edges.filter(checkPointerEdge(false))
        }, this.forceUpdate.bind(this));
    }

    onEndDragEnter (target, event) {
        event.preventDefault();
    }

    onEndDragOver (target, event) {
        event.preventDefault();
    }

    onEndDrop (target, event) {
        event.preventDefault();
        const origin = JSON.parse(event.dataTransfer.getData('endDrag') || "false");
        if (!origin) return;
        this.setState({
            edges: this.state.edges.concat({id: ID(), ends: [target, origin]})
        });
    }

    render () {
        const handlers = objectMap(getOnEventMethods(this), (id,func) => target => event => func(target,event));
        return <Graph {...handlers} keepGraph={false}>{this.state}</Graph>;
    }
}
