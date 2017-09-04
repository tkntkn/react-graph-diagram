python -m http.server 3000 &
npx rollup -c --watch &
for name in `find sample -mindepth 1 -maxdepth 1 -name "*.jsx" -printf "%f\n"`; do
    env name=${name::-4} npx rollup -c rollup.config.sample.js --watch &
done
wait
