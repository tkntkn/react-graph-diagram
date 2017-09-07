export const PureGraphSample = {
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

export const PortGraphSample = {
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

export const FlowGraphSample = {
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
