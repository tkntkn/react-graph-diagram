pids=()

function sigint () {
    for pid in ${pids[@]}; do
        kill $pid
    done
    # clear
}

python -m http.server &
pids+=( $! )

npx rollup -c --watch &
pids+=( $! )

env from='src/pure-simple.jsx' to='pure/simple/index.js' npx rollup -c rollup.config.sample.js --watch &
pids+=( $! )

env from='src/pure-events.jsx' to='pure/events/index.js' npx rollup -c rollup.config.sample.js --watch &
pids+=( $! )

env from='src/port-simple.jsx' to='port/simple/index.js' npx rollup -c rollup.config.sample.js --watch &
pids+=( $! )

env from='src/port-events.jsx' to='port/events/index.js' npx rollup -c rollup.config.sample.js --watch &
pids+=( $! )

trap 'sigint' INT TERM

wait
