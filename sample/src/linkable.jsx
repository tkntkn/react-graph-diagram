import React from 'react';
import {PureGraph} from './PureGraph'
import {getOnEventMethods, getOnEventProps} from './ReactUtils';
import {dummyImage, ID, pointer, objectMap, vecaddsub} from './Utils';

export const POINTER_END_ID = "react-graph-diagram::POINTER_END_ID";
export const makePointerEnd = position => ({id:POINTER_END_ID, position});
export const updateEndPointerEnd  = position => end  => end.id === POINTER_END_ID ? makePointerEnd(position) : end
export const updateEndsPointerEnd = position => ends => ends.map(updateEndPointerEnd(position));
export const updateEdgePointerEnd = position => edge => Object.assign({}, edge, {ends:updateEndsPointerEnd(position)(edge.ends)});





// const makeEdge = (end1, end2) => {
//     return {id:ID(), ends: [end1, end2]};
// }

// const assignToTarget = (target, data) => {
//     return compare => compare.id === target.id ? Object.assign(compare, data): compare;
// }

// const checkLinkedEdge = (target, is) => {
//     return compare => compare.ends.find(e => e.id === target.id) ? is : !is
// }

const prop = (key, value) => obj => (typeof value !== "undefined") ? obj[key] = value : obj[key]
const linked = t => node => edge => edge.ends.find(same(true)(node)) ? t : !t;

const isPointerEnd  = is => end  => end.id===POINTER_END_ID ? is : !is;
const isPointerEdge = is => edge => edge.ends.some(isPointerEnd(true)) ? is : !is;

const Edge = src => dst => ({id: ID(), ends: {src, dst}});
const PointerEdge = pointer => end => Edge({id:POINTER_END_ID, position})(end);

const updateOnly = cond => update => obj => cond(obj) ? update(obj) : obj;

const dragFromEnd = event => JSON.parse(event.dataTransfer.getData('endDrag') || "false");

export const graphEventHandler = stateHandler => ({
    onEndDragStart: (end, event) => { stateHandler.edges.add(PointerEdge(pointer(event))(end)); },
    onEndDragEnd:   (end, event) => { stateHandler.edges.removePointerEdge(); },
    onEndDrop:      (end, event) => { if (dragFromEnd(event)) stateHandler.edges.add(Edge(end)(dragFromEnd(event))); },
});

export const nodeEventHandler = (handlers) => ({
    onDoubleClick: event => {
        handlers.onNodeDoubleClick(this, event);
    },
});

export const edgeEventHandler = (handlers) => ({
    onDoubleClick: event => { handlers.onEdgeDoubleClick(this, event); }
});

export const portEventHandler = (handlers) => ({
    onDoubleClick: (event) => { handlers.onNodeDoubleClick(this, event); },
    onDragStart: (end, event) => { stateHandler.edges.add(PointerEdge(pointer(event))(end)) },
    onDragEnd:   (end, event) => { stateHandler.edges.removePointerEdge() },
    onDragEnter: (target, event) => { if (dragFromEnd(event)) event.preventDefault(); },
    onDragOver:  (target, event) => { if (dragFromEnd(event)) event.preventDefault(); },
    onDrop: (target, event) => { if (dragFromEnd(event)) stateHandler.edges.add(Edge(target)(dragFromEnd(event))) }
});




// onEndDragStart (target, event) {
//     event.stopPropagation();
//     event.dataTransfer.setDragImage(dummyImage, 0, 0);
//     event.dataTransfer.setData('endDrag', JSON.stringify(target));
//     this.setState({
//         edges: this.state.edges.concat(this.makePointerEdge(pointer(event), target))
//     });
// }

// onEndDrag (target, event) {
//     event.stopPropagation();
//     if (pointer(event).x === 0 && pointer(event).y === 0) return;
//     this.setState({
//         edges: this.state.edges.map(updateEdgePointerEnd(pointer(event)))
//     });
// }

// onEndDragEnd (target, event) {
//     event.stopPropagation();
//     this.setState({
//         edges: this.state.edges.filter()
//     }, this.forceUpdate.bind(this));
// }

// onEndDragEnter (target, event) {
//     event.preventDefault();
// }

// onEndDragOver (target, event) {
//     event.preventDefault();
// }

// onEndDrop (target, event) {
//     event.preventDefault();
//     const origin = JSON.parse(event.dataTransfer.getData('endDrag') || "false");
//     if (!origin) return;
//     this.setState({
//         edges: this.state.edges.concat({id: ID(), ends: [target, origin]})
//     });
// }



Graph = class extends Graph {
    calcEndPosition (end) {
        if (end.id === POINTER_END_ID) return end.position;
        return super.calcEndPosition(end);
    }
};
