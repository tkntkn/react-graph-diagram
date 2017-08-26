npx rollup --config rollup.config.sample.js -format=es -i sample/pure/index.jsx -o sample/pure/index.js &
npx rollup --config rollup.config.sample.js -format=es -i sample/port/index.jsx -o sample/port/index.js &
npx rollup --config rollup.config.sample.js -format=es -i sample/flow/index.jsx -o sample/flow/index.js &
wait
