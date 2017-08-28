import React from 'react';
import {PureGraph} from './PureGraph';
import {POINTER_END_ID} from './DynamicContainer';
import {getOnEventMethods, getOnEventProps} from './ReactUtils';
import {objectMap} from './Utils';

export const PortGraph = function (Node, Edge, Port) {
    return class extends PureGraph(Node, Edge) {
        mapPortToProps (port) { return Object.assign(this.portEventHandlers, {port}); }
        assignIdToEnd  (end)  { return Object.assign({}, end,  {id: this.calcPortId(end)}); }
        assignIdToEdge (edge) { return Object.assign({}, edge, {ends: edge.ends.map(this.assignIdToEnd.bind(this))}); }

        renderNode (node) {
            return (
                <Node key={node.id} ref={node.id} {...this.mapNodeToProps(node)}>
                    { this.ports[node.id].map(this.renderPort.bind(this)) }
                </Node>
            );
        }

        renderPort (port) {
            return <Port key={port.id} ref={port.id} {...this.mapPortToProps(port)} />
        }

        prepareGraph () {
            super.prepareGraph(true);
            this.edges = this.edges.map(this.assignIdToEdge.bind(this))

            this.ports = Object.assign({}, ...this.nodes.map(node => ({
                [node.id]: Array.from(Array(node.size))
                    .map((_, index)=> ({id:this.calcPortId({node:node.id, index}), node:node.id, index}))
            })));

            this.portEventHandlers = Object.assign({},
                getOnEventProps(this.props, "Port", null, "Port"),
                getOnEventProps(this.props, "End", null, "Port"),
            );
        }

        calcPortId (port) {
            return port.id || `port-${port.node}-${port.index}`;
        }
    };
};
