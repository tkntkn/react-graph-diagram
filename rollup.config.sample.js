import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

import path from 'path';
import fs from  'fs';

const selfImport = option => {
    const root = __dirname;
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
    const main = path.join(root, pkg.main);
    return {
        resolveId: ( importee, importer )  => {
            return (importee === pkg.name) ? main : null;
        }
    }
};

export default {
    plugins: [
        replace({ 'process.env.NODE_ENV': process.env.NODE_ENV }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: ['react'],
            plugins: ['external-helpers']
        }),
        resolve({
            browser: true,
            main: true,
            extensions: [ '.js', '.jsx' ]
        }),
        commonjs(),
        selfImport(),
    ]
};
