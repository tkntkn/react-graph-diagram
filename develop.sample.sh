pids=()

python -m http.server & pids+=( $! )
npx rollup -c --watch & pids+=( $! )
env from='pure-simple.jsx' to='pure/simple/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )
env from='pure-events.jsx' to='pure/events/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )
env from='port-simple.jsx' to='port/simple/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )
env from='port-events.jsx' to='port/events/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )
env from='flow-simple.jsx' to='flow/simple/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )
env from='flow-events.jsx' to='flow/events/index.js' npx rollup -c rollup.config.sample.js --watch & pids+=( $! )

trap 'for pid in ${pids[@]}; do kill $pid; done' INT TERM
wait
