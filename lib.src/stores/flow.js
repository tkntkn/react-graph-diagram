import {ID} from '../utils';

export {assign, when, emptyData, makeEdge, predicate} from './port';
export const makeNode = (position, size={in:2, out:2}) => ({id:ID(), position, size});
