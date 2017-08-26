/**
 * Update object deeply without destruction of original object.
 * @param {Object} _obj 
 * @param {Object} updates Keys should be joined by "."  
 */
const deepUpdate = (_obj, updates) => {
    let obj = Object.assign({}, _obj);
    Object.keys(updates).forEach(path => {
        let ref = obj;
        let keys = path.split(".");
        let key;
        while (key = keys.shift()) {
            if (keys.length !== 0) {
                ref[key] = Object.assign(Array.isArray(ref[key]) ? [] : {}, ref[key]);
                ref = ref[key];
            } else {
                ref[key] = updates[path];
            }
        }
    });
    return obj;
}

/**
 * Compare object values deepley
 * @param {Object} a 
 * @param {Object} b
 */
const deepEquals = (a,b) => {
    let tya = typeof a;
    let tyb = typeof b;
    if (tya!==tyb) return false;
    if (tya==="object") {
        let keya = Object.keys(a).sort();
        let keyb = Object.keys(b).sort();
        return a===b || keya.every((k,i) => k===keyb[i] && deepEquals(a[k], b[k]));
    }
    return a===b;
}

const vectorAdd = (a,b) => ({x:a.x+b.x, y:a.y+b.y});
const vectorSub = (a,b) => ({x:a.x-b.x, y:a.y-b.y});

export {deepUpdate, deepEquals, vectorAdd, vectorSub};
