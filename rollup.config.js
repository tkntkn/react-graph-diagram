import babel from "rollup-plugin-babel";

import {resolve, dirname} from 'path';
import {existsSync as exists} from  'fs';

const resolveJSX = option => {
    return {
        resolveId: (importee, importer)  => {
            if (!importer) return null;
            const file = resolve(dirname(importer), importee)+ '.jsx';
            return exists(file) ? file : null;
        }
    }
};

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'es'
    },
    plugins: [
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: ['react'],
            plugins: ['external-helpers']
        }),
        resolveJSX(),
    ]
};
