import {ID} from '../utils';

export {assign, when, emptyData, makeEdge, predicate} from './port';
export const makeNode = (position, inlets=2, outlets=2) => ({id:ID(), position, inlets, outlets});
