export const getOnEventMethods = self => {
    const handlerNames = Object.getOwnPropertyNames(Object.getPrototypeOf(self)).filter(name => name.startsWith("on"));
    return Object.assign({}, ...handlerNames.map(name => ({[name]: self[name].bind(self)}) ));
}

export const getOnEventProps = (props, keyword, args, replace="") => {
    if (typeof replace!=="string" && !replace) replace = keyword;
    const handlerNames = Object.getOwnPropertyNames(props).filter(name => name.startsWith(`on${keyword}`));
    return args
        ? Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,replace)]: props[name](...args)}) ))
        : Object.assign({}, ...handlerNames.map(name => ({[name.replace(keyword,replace)]: props[name]}) ));
}
