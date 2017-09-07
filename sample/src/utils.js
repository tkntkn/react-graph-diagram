export const polar = (r, θ) => ({x:r*Math.cos(θ), y:r*Math.sin(θ)});
export const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
export const pointer = event => ({x:event.clientX, y:event.clientY});



export const getPrototypeNames = (head, functionOnly=false) => {
    const names = [];
    do names.push(...Object.getOwnPropertyNames(head)); while (head = Object.getPrototypeOf(head));
    return names;
}

export const selectBindedPrototypes = (obj, pattern) => {
    const names = getPrototypeNames(obj).filter(name => name.match(pattern));
    const proto = {};
    names.forEach(name => proto[name] = obj[name].bind(obj));
    return proto;
}
