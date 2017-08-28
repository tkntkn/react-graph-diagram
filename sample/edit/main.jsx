import React from 'react';
import ReactDOM from 'react-dom';
import {EditGraph, FREE_PORT_ID} from 'react-graph-diagram';

class Edge extends EditGraph.Edge {
    render () {
        const [a, b] = this.props.endPositions;

        const diff = Math.abs(a.y - b.y);
        const p1 = `${a.x},${a.y}`;
        const p2 = `${a.x},${a.y + diff + 30}`;
        const p3 = `${b.x},${b.y - diff - 30}`;
        const p4 = `${b.x},${b.y}`;

        const className = `edge`;
        return <path className="edge" d={`M${p1} C${p2} ${p3} ${p4}`} />
    }
}

class Port extends EditGraph.Port {
    onDragStart (e) {
        e.stopPropagation();
    }

    onDrag (e) {
    }

    onDragEnd (e) {
    }

    onDrop (e) {
    }

    render () {
        const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => name.startsWith("on"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name]: this[name].bind(this)}) ));

        const style = { left: `${this.props.r*53 - (3 + 2 * 3 + 4) / 2 }px` };
        const className = `port ${this.props.port.flow}`;
        return <span draggable ref="point" className={className} style={style} {...handlers}/>
    }

    static getProps (port, props) {
        const node = props.children.nodes.find(node => node.id === port.node);
        const r = (port.index+1)/(node[port.flow]+1);
        return Object.assign(super.getProps(port, props), {r})
    }
}


const pointer = (e) => ({x: e.clientX, y:e.clientY});
const vecaddsub = (a,b,c) => ({x: a.x+b.x-c.x, y:a.y+b.y-c.y});
class Node extends EditGraph.Node {
    constructor (props) {
        super(props);
        this.state = {current: false, origin: false}
    }

    onDragStart (e) {
        const img = document.createElement('img')
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        e.dataTransfer.setDragImage(img, 0, 0)
        this.setState({current: pointer(e), origin: pointer(e)});
    }

    onDrag (e) {
        // avoid bug
        if (pointer(e).x === 0 && pointer(e).y === 0) return;
        this.setState({current: pointer(e)})
        this.props.renderEdges();
    }

    onDragEnd (e) {
        this.props.onNodeDragEnd(this.props.node, this.dragPosition());
        this.setState({current: false, origin: false});
    }

    dragPosition () {
        return this.state.origin
            ? vecaddsub(this.props.node.position, this.state.current, this.state.origin)
            : this.props.node.position;
    }

    render () {
        const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => name.startsWith("on"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name]: this[name].bind(this)}) ));

        const position = this.dragPosition();
        const style = {left: position.x, top: position.y};
        return (
            <div draggable className="node" style={style} {...handlers}>
                {this.props.node.id}
                {this.props.children}
            </div>
        );
    }
}

const init = {
    nodes: [
        {id: "n1", in: 3, out: 3, position: {x: 100, y: 150}},
        {id: "n2", in: 3, out: 3, position: {x: 300, y: 200}},
        {id: "n3", in: 3, out: 3, position: {x: 400, y: 100}},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", flow:'out', index:0}, {node:"n2", flow:'in', index:1}]},
        {id: "e2", ends: [{node:"n2", flow:'out', index:2}, {node:"n3", flow:'in', index:0}]},
        {id: "c1", ends: [{node:"n3", flow:'out', index:0}, {id: FREE_PORT_ID, position: {x:0, y:0}}]},
    ],
};

const Graph = EditGraph(Node, Port, Edge);
class GraphContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = init;
    }

    onNodeDragEnd (node, position) {
        const update = node => Object.assign({}, node, {position});
        this.setState({
            nodes: this.state.nodes.map(n => node.id === n.id ? update(n) : n)
        });
    }

    onPortDragEnd (from, to) {

    }

    render () {
        const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => name.startsWith("on"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name]: this[name].bind(this)}) ));
        return <Graph {...handlers}>{this.state}</Graph>;
    }
}

ReactDOM.render(<GraphContainer />, document.getElementById("container"));

