import React from 'react';
import {Movable} from './movable';
import {End} from '../components/base';

const pointer = event => ({x:event.clientX, y:event.clientY});
const dummyImage = document.createElement('img');
dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const POINTER_END_ID  = "react-graph-diagram::POINTER_END_ID";
const POINTER_EDGE_ID = "react-graph-diagram::POINTER_EDGE_ID";
const defaultOptions = {
    linkEndType: 'nodes',
    newLinkEnd: position => ({id:POINTER_END_ID, position}),
    newLinkEdge: (src,dst) => ({id:POINTER_EDGE_ID, ends:{src,dst}}),
}

const MovableEnd = Movable(End, {
    propsToPosition: props => props.node.position
})

class PointerEnd extends MovableEnd {
    render () {
        return null;
    }

    getEndPosition () {
        return this.position;
    }
}

export const Linkable = (ReactComponent, options={}) => {
    options = Object.assign({}, defaultOptions, options || {});
    return class extends ReactComponent {
        constructor (props) {
            super(props);
            this.linkEnd  = null;
            this.linkEdge = null;
        }

        render () {
            console.log(super.render());
            return React.cloneElement(super.render());
        }

        prepareGraph () {
            if (this.linkEnd) {
                this[options.linkEndType] = this[options.linkEndType].concat(this.linkEnd);
            }
            if (this.linkEdge) {
                this.edges = this.edges.concat(this.linkEdge);
            }
        }

        onLinkStart (event, src) {
            event.dataTransfer.setDragImage(dummyImage, 0, 0);
            const position = pointer(event);
            this.linkEnd  = options.newLinkEnd(position);
            this.linkEdge = options.newLinkEdge(src, this.linkEnd);
            this.prepareGraph();
            this.forceUpdate(() => this.refs[this.linkEnd.id].updatePosition(position, true));
        }

        onLink (event) {
            const position = pointer(event);
            if (!this.linkEnd) {
                console.error('Link not started.')
            } else if (!this.refs[this.linkEnd.id]) {
                this.forceUpdate(() => {
                    this.refs[this.linkEnd.id].updatePosition(position, true, true);
                });
            } else {
                this.refs[this.linkEnd.id].updatePosition(position, true, true);
            }
        }

        onLinkEnd (event) {
            this.linkEnd  = null;
            this.linkEdge = null;
            this.prepareGraph();
            this.forceUpdate();
        }
    }
}
