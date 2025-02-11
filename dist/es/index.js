import { fork } from 'child_process';
import { resolve, dirname, join } from 'path';

function run(opts = {}) {
    let input;
    let proc;
    const args = opts.args || [];
    const allowRestarts = opts.allowRestarts || false;
    const overrideInput = opts.input;
    const forkOptions = opts.options || opts;
    delete forkOptions.args;
    delete forkOptions.allowRestarts;
    return {
        name: 'run',
        buildStart(options) {
            let inputs = overrideInput !== null && overrideInput !== void 0 ? overrideInput : options.input;
            if (typeof inputs === 'string') {
                inputs = [inputs];
            }
            if (typeof inputs === 'object') {
                inputs = Object.values(inputs);
            }
            if (inputs.length > 1) {
                throw new Error(`@rollup/plugin-run must have a single entry point; consider setting the \`input\` option`);
            }
            input = resolve(inputs[0]);
        },
        generateBundle(_outputOptions, _bundle, isWrite) {
            if (!isWrite) {
                this.error(`@rollup/plugin-run currently only works with bundles that are written to disk`);
            }
        },
        writeBundle(outputOptions, bundle) {
            const forkBundle = (dir, entryFileName) => {
                if (proc)
                    proc.kill();
                proc = fork(join(dir, entryFileName), args, forkOptions);
            };
            const dir = outputOptions.dir || dirname(outputOptions.file);
            const entryFileName = Object.keys(bundle).find((fileName) => {
                const chunk = bundle[fileName];
                return chunk.isEntry && chunk.facadeModuleId === input;
            });
            if (entryFileName) {
                forkBundle(dir, entryFileName);
                if (allowRestarts) {
                    process.stdin.resume();
                    process.stdin.setEncoding('utf8');
                    process.stdin.on('data', (data) => {
                        const line = data.toString().trim().toLowerCase();
                        if (line === 'rs' || line === 'restart' || data.toString().charCodeAt(0) === 11) {
                            forkBundle(dir, entryFileName);
                        }
                        else if (line === 'cls' || line === 'clear' || data.toString().charCodeAt(0) === 12) {
                            // eslint-disable-next-line no-console
                            console.clear();
                        }
                    });
                }
            }
            else {
                this.error(`@rollup/plugin-run could not find output chunk`);
            }
        }
    };
}

export { run as default };
//# sourceMappingURL=index.js.map
