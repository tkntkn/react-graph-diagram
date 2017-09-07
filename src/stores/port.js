const check = v => [console.log(v), v][1]
const assign = update => original => Object.assign({}, original, update);
const when = pred => func => obj => pred(obj) ? func(obj) : obj

const ID = (function () {let i = 1; return () => `ID${i++}`;})();
const RANDN = n => Math.floor(Math.random() * n + 1);

const is = {
    sameAs:     obj1 => obj2 => obj1.id === obj2.id,
    notSameAs:  obj1 => obj2 => !is.sameAs(obj1)(obj2),
    linking:    end => edge => Object.values(edge.ends).some(is.sameAs(end)),
    notLinking: end => edge => !is.linking(end)(edge),
}

export const DataHandler = data => ({
    addNode: node => ({
        nodes: data.nodes.concat(node)
    }),
    removeNode: node => ({
        nodes: data.nodes.filter(is.notSameAs(node)),
        edges: data.edges.filter(is.notLinking(node)),
    }),
    updateNode: (node, update) => ({
        nodes: data.nodes.map(when(is.sameAs(node))(assign(update)))
    }),
    addEdge: edge => ({
        edges: data.edges.concat(edge)
    }),
    removeEdge: edge => ({
        edges: data.edges.filter(is.notSameAs(edge))
    }),
    addNodeEdge: (node, edge) => ({
        nodes: data.nodes.concat(node),
        edges: data.edges.concat(edge),
    }),
});

export const NewPureNode = position => ({id:ID(), position});
export const NewPortNode = position => ({id:ID(), position, size: RANDN(10)});
export const NewFlowNode = position => ({id:ID(), position, in: RANDN(3), out: RANDN(3)});

export const NewEdge = (src,dst) => ({id:ID(), ends:{src,dst}});

export const POINTER_END_ID = "react-graph-diagram::POINTER_END_ID";
export const PointerEnd  = position => ({id:POINTER_END_ID, position});

export const PureData = {
    nodes: [
        {id: "n1", position: {x: 100, y: 150}},
        {id: "n2", position: {x: 300, y: 200}},
        {id: "n3", position: {x: 400, y: 100}},
    ],
    edges: [
        {id: "e1", ends: {src:{id:"n1"}, dst:{id:"n2"}}},
        {id: "e2", ends: {src:{id:"n2"}, dst:{id:"n3"}}},
    ],
}

export const PortData = {
    nodes: [
        {id: "n1", position: {x:100, y:150}, size: 6},
        {id: "n2", position: {x:300, y:200}, size: 6},
        {id: "n3", position: {x:400, y:100}, size: 6},
    ],
    edges: [
        {id: "e1", ends: {src:{node:"n1", index:0}, dst:{node:"n2", index:2}}},
        {id: "e2", ends: {src:{node:"n2", index:5}, dst:{node:"n3", index:3}}},
    ],
}

export const FlowData = {
    nodes: [
        {id: "n1", position: {x:100, y:150}, in: 3, out: 3},
        {id: "n2", position: {x:300, y:200}, in: 3, out: 3},
        {id: "n3", position: {x:400, y:100}, in: 3, out: 3},
    ],
    edges: [
        {id: "e1", ends: [{node:"n1", flow:'out', index:0}, {node:"n2", flow:'in', index:1}]},
        {id: "e2", ends: [{node:"n2", flow:'out', index:2}, {node:"n3", flow:'in', index:0}]},
    ],
};
