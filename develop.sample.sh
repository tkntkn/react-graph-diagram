python -m http.server 3000 &
npx rollup -c --watch &
env from='src/pure-simple.jsx' to='pure/simple/index.js' npx rollup -c rollup.config.sample.js --watch &
wait
