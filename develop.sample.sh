python -m http.server &
npx rollup -c --watch &
env from='src/pure-simple.jsx' to='pure/simple/index.js' npx rollup -c rollup.config.sample.js --watch &
env from='src/pure-events.jsx' to='pure/events/index.js' npx rollup -c rollup.config.sample.js --watch &
wait
