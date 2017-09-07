import {ID} from '../utils';

export {assign, when, emptyData, makeEdge} from './pure';

export const makeNode = (position, size=3)  => ({id:ID(), position, size});
export const predicate = {
    sameAs:     obj1 => obj2 => obj1.id === obj2.id,
    notSameAs:  obj1 => obj2 => !predicate.sameAs(obj1)(obj2),
    portOf:     node => port => port.node === node.id,
    linking:    node => edge => Object.values(edge.ends).some(predicate.portOf(node)),
    notLinking: node => edge => !predicate.linking(node)(edge),
};

