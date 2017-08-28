export const dummyImage = document.createElement('img'); dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const ID = (function () {let i = 1; return () => `ID${i++}`;})();
export const pointer = event => ({x:event.clientX, y:event.clientY});
export const objectMap = (object, mapper) =>
    Object.assign({}, ...Object.entries(object).map(([key,value]) => ({[key]: mapper(key,value)})));
