npx rollup -c --watch &
for sample in `find sample -mindepth 1 -maxdepth 1 -type d -printf "%f\n"`; do
    env sample=$sample npx rollup -c rollup.config.sample.js --watch &
done
wait
