export const polar = (r, θ) => ({x:r*Math.cos(θ), y:r*Math.sin(θ)});
export const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
