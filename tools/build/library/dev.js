const { watch } = require('rollup');

function log(...s) {
    console.log('\x1b[32m%s\x1b[0m', ...s);
}

function error(...s) {
    console.log('\x1b[31m%s\x1b[0m', ...s);
}

module.exports = {
    async buildDev(sourceConfig, config) {
        let watcher = await watch(config);

        watcher.on('event', e => {
            switch (e.code) {
            case 'START': break;
            case 'BUNDLE_START': log(`Start building ${sourceConfig.name} ...`); break;
            case 'BUNDLE_END': log(`Build ${sourceConfig.name} completed in ${(e.duration/1000).toFixed(2)} sec`); break;
            case 'END': break;
            default: 
                let { id, loc, codeFrame } = e.error;

                error('Error', e.error.message);
                log(id+':'+loc.line);
                log(codeFrame); break;
            }
        });
    }
}