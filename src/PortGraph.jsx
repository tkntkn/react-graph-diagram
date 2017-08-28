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
            let ports = Object.assign({}, ...this.nodes.map(node => ({[node.id]: node})));
            ports = objectMap(ports, (id, node) => Array.from(Array(node.size)).map((_,i)=>i));
            ports = objectMap(ports, (id, indexes) => indexes.map(index => ({node:id, index})));
            ports = objectMap(ports, (id, ports) => ports.map(port  => Object.assign({id: this.calcPortId(port)},port)));
            this.ports = ports;
            this.portEventHandlers = Object.assign({},
                getOnEventProps(this.props, "Port", null, "Port"),
                getOnEventProps(this.props, "End", null, "Port"),
            );

            this.nodes.forEach(node => node.edges = []);
            this.edges = this.edges.map(this.assignIdToEdge.bind(this))
            this.edges.forEach(edge => {
                edge.ends.forEach(end => {
                    if (end.id === POINTER_END_ID) return;
                    const node = this.nodes.find(node => node.id === end.node);
                    node.edges.push(edge.id);
                })
            });
        }

        calcPortId (port) {
            return port.id || `port-${port.node}-${port.index}`;
        }
    };
}

PortGraph.Node = class extends PureGraph.Node {}
PortGraph.Edge = class extends PureGraph.Edge {}
PortGraph.Port = class extends React.Component {}
