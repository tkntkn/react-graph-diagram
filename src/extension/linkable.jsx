import React from 'react';
import {Movable} from './movable';
import {End} from '../components/base';

const pointer = event => ({x:event.clientX, y:event.clientY});
const dummyImage = document.createElement('img');
dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const POINTER_END_ID  = "react-graph-diagram::POINTER_END_ID";
const POINTER_EDGE_ID = "react-graph-diagram::POINTER_EDGE_ID";

const check = v => [v, console.log(v)];

const propsToPosition = props => props.node.position;
class LinkNode extends Movable(End, {propsToPosition}) {
    render () { return null; }
    getEndPosition () { return this.position; }
}

export const Linkable = (ReactComponent) => {
    const onLinkStart = function (event, src) {
        event.dataTransfer.setDragImage(dummyImage, 0, 0);
        const position = pointer(event);
        this.linkNode = {id:POINTER_END_ID, position};
        this.linkEdge = {id:POINTER_EDGE_ID, ends:{src, dst:this.linkNode}};
        this.prepareGraph();
        this.forceUpdate(() => this.refs[POINTER_END_ID].updatePosition(position, true));
    };

    const onLink = function (event) {
        const position = pointer(event);
        if (!this.linkNode) {
            console.error('Link not started.')
        } else {
            const ref = this.refs[POINTER_END_ID];
            if (ref) {
                ref.updatePosition(position, true, true);
            } else {
                this.forceUpdate(() => {
                    this.refs[POINTER_END_ID].updatePosition(position, true, true);
                });
            }
        }
    };

    const onLinkFinish = function (event) {
        this.linkNode = null;
        this.linkEdge = null;
        this.prepareGraph();
        this.forceUpdate();
    };

    return class extends ReactComponent {
        constructor (props) {
            super(props);
            this.linkNode = null;
            this.linkEdge = null;
            this.linkHandlers = {
                onLinkStart: onLinkStart.bind(this),
                onLink: onLink.bind(this),
                onLinkFinish: onLinkFinish.bind(this)
            };
        }

        renderNode (node) {
            if (node.id === POINTER_END_ID) {
                return <LinkNode
                    key={node.id} ref={node.id}
                    {...this.makeNodeProps(node)}
                    {...this.makeEndProps(node)}
                />
            } else {
                return super.renderNode(node);
            }
        }

        prepareGraph () {
            this.nodes = this.nodes.concat(this.linkNode || []);
            this.edges = this.edges.concat(this.linkEdge || []);
        }
    }
}
