import {ID} from '../utils';
export const makeNode =  position  => ({id:ID(), position});
export const makeEdge = (src, dst) => ({id:ID(), ends:{src,dst}});

export const assign = update => original => Object.assign({}, original, update);
export const when = pred => func => obj => pred(obj) ? func(obj) : obj;

export const predicate = {
    sameAs:     obj1 => obj2 => obj1.id === obj2.id,
    notSameAs:  obj1 => obj2 => !predicate.sameAs(obj1)(obj2),
    linking:    end => edge => Object.values(edge.ends).some(predicate.sameAs(end)),
    notLinking: end => edge => !predicate.linking(end)(edge),
};

export const initData = { nodes: [], edges: [] };
