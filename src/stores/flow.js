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
