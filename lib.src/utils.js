export const ID = (function () {let i = 1; return () => `ID${i++}`;})();
export const objectMap = (object, mapper) => Object.assign({}, ...Object.entries(object).map(([key,value]) => ({[key]: mapper(key,value)})));
export const NArray = size => Array.from(Array(size)).map((_,i) => i);
export const tap = obj => func => [func(obj), obj][1];
