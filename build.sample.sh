npx rollup --config rollup.config.sample.js -format=es -m inline -i sample/pure/index.jsx -o sample/pure/index.js &
npx rollup --config rollup.config.sample.js -format=es -m inline -i sample/port/index.jsx -o sample/port/index.js &
npx rollup --config rollup.config.sample.js -format=es -m inline -i sample/flow/index.jsx -o sample/flow/index.js &
wait
