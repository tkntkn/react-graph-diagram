import React from 'react';
import ReactDOM from 'react-dom';
import {EditGraph, POINTER_NODE_ID} from 'react-graph-diagram';

const ID = (function () {
    let i = 1;
    return () => `react-graph-diagram-ID${i++}`;
})()

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
    render () {
        const handlerNames = Object.getOwnPropertyNames(this.props).filter(name => name.startsWith("onPort"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name.replace("Port","")]: this.props[name].bind(this, this.props.port, this.props.edge)}) ));
        const style = { left: `${this.props.r*53 - (3 + 2 * 3 + 4) / 2 }px` };
        const className = `port ${this.props.port.flow}`;
        return <span draggable ref="point" className={className} style={style} {...handlers}/>
    }

    static getProps (port, props) {
        const node = props.children.nodes.find(node => node.id === port.node);
        const edge = props.children.edges.find(edge => Edge.getEnds(edge).map(Port.getId).includes(Port.getId(port)));
        const r = (port.index+1)/(node[port.flow]+1);
        return Object.assign(super.getProps(port, props), {node, edge, r})
    }

    static getPosition (port, element, props) {
        if (Port.getId(port) === POINTER_NODE_ID) return props.children.nodes.find(node => node.id === POINTER_NODE_ID).position;
        return super.getPosition(port, element, props);
    }
}

const setDummyDragImage = (e) => {
    const img = document.createElement('img')
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
}

const pointer = (e) => ({x: e.clientX, y:e.clientY});
const vecaddsub = (a,b,c) => ({x: a.x+b.x-c.x, y:a.y+b.y-c.y});
class Node extends EditGraph.Node {
    constructor (props) {
        super(props);
        this.state = {current: false, origin: false}
    }

    componentDidUpdate () {
        this.props.renderEdges();
    }

    onDragStart (e) {
        setDummyDragImage(e);
        this.setState({current: pointer(e), origin: pointer(e)});
    }

    onDrag (e) {
        // avoid bug
        if (pointer(e).x === 0 && pointer(e).y === 0) return;
        this.setState({current: pointer(e)});
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
        const position = this.dragPosition();
        const style = {left: position.x, top: position.y};

        if (Node.getId(this.props.node)===POINTER_NODE_ID) {
            return <div className="port" style={Object.assign({transform: 'translate(-50%, -50%)', pointerEvents: 'none'}, style)} />
        }

        const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => name.startsWith("on"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name]: this[name].bind(this)}) ));
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
        // {id: POINTER_NODE_ID, position: {x: 0, y: 0}}
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", flow:'out', index:0}, {node:"n2", flow:'in', index:1}]},
        {id: "e2", ends: [{node:"n2", flow:'out', index:2}, {node:"n3", flow:'in', index:0}]},
        // {id: "c1", ends: [{node:"n3", flow:'out', index:0}, {id: POINTER_NODE_ID}]},
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
            nodes: this.state.nodes.map(n => n.id === node.id  ? update(n) : n)
        });
    }

    onPortDragStart (from, edge, e) {
        setDummyDragImage(e);
        e.stopPropagation();
        const filter = edge => Edge.getEnds(edge).every(n => Port.getId(n)!==Port.getId(from));
        const newnode = {id: POINTER_NODE_ID, position: pointer(e)};
        const base = (edge) ? Edge.getEnds(edge).find(port => Port.getId(port)!==Port.getId(from)) : from;
        const newends = base.flow === 'out' ? [base, {id: POINTER_NODE_ID}] : [{id: POINTER_NODE_ID}, base];
        const newedge = {id: POINTER_NODE_ID, ends: newends};
        e.dataTransfer.setData('port-briding', JSON.stringify({base, from, edge}));
        this.setState({
            nodes: this.state.nodes.concat(newnode),
            edges: this.state.edges.filter(filter).concat(newedge)
        });
    }

    onPortDrag (from, edge, e) {
        // avoid bug
        if (pointer(e).x === 0 && pointer(e).y === 0) return;
        const pointerNode = {id: POINTER_NODE_ID, position: pointer(e)};
        this.setState({
            nodes: this.state.nodes.map(n => n.id === POINTER_NODE_ID ? pointerNode : n)
        });
    }

    onPortDragEnd (from, edge, e) {
        const filter = edge => Edge.getEnds(edge).every(n => Port.getId(n)!==POINTER_NODE_ID);
        // avoid bug
        setTimeout(() =>
        this.setState({
            nodes: this.state.nodes.filter(node => Node.getId(node)!==POINTER_NODE_ID),
            edges: this.state.edges.filter(filter)
        })
        ,0);
    }

    onPortDragEnter (from, edge, e) {
        e.preventDefault();

    }

    onPortDragOver (from, edge, e) {
        e.preventDefault();
    }

    onPortDrop (to, edge, e) {
        e.preventDefault();
        const data = e.dataTransfer.getData('port-briding');
        if (!data) return;
        const {base} = JSON.parse(data);
        const newedge = {id: ID(), ends: base.flow==='out' ? [base, to] : [to, base]}
        this.setState({
            edges: this.state.edges.concat(newedge)
        });
    }

    render () {
        const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => name.startsWith("on"));
        const handlers = Object.assign({}, ...handlerNames.map(name => ({[name]: this[name].bind(this)}) ));
        return <Graph {...handlers}>{this.state}</Graph>;
    }
}

ReactDOM.render(<GraphContainer />, document.getElementById("container"));

