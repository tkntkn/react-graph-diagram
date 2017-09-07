export const getPrototypes = function * (head) {
    do {
        yield Object.getOwnPropertyNames(head)
    } while (head = Object.getPrototypeOf(head));
}

export const getOnEventMethods = self => {
    const prototypes = [].concat(...Array.from(getPrototypes(self)));
    const handlerNames = prototypes.filter(name => name.startsWith("on"))
    return Object.assign({}, ...handlerNames.map(name => ({[name]: self[name].bind(self)}) ));
}

function getAllFuncs(obj) {
    var props = [];

    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) {
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}

export const getOnEventProps = (props, keyword, args, replace="") => {
    if (typeof replace!=="string" && !replace) replace = keyword;
    const handlerNames = Object.getOwnPropertyNames(props).filter(name => name.startsWith(`on${keyword}`));
    return args
        ? Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,replace)]: props[name](...args)}) ))
        : Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,replace)]: props[name]}) ));
}
