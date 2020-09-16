const { rollup } = require('rollup');
const buildConfig = require('./config');
const { buildDev } = require('./dev');

require('@babel/register')({
  presets: [require('@babel/preset-env').default],
  ignore: [/node_modules/],
});

let opts = [
  { suffix: 'min', format: 'umd', minify: true, polyfill: true },
  { suffix: 'esm', format: 'es' },
  { suffix: 'common', format: 'cjs' },
];

function resources(program) {
  let configPath = `${process.cwd()}/${program.build}`;
  let packagePath = `${process.cwd()}/package.json`;
  let config = require(configPath).default;
  let pkg = require(packagePath);

  return { config, pkg };
}

module.exports = async (program) => {
  let { config, pkg } = resources(program);

  if (program.watch) {
    let targetConfig = buildConfig(config, pkg, opts[0]);

    return await buildDev(config, targetConfig);
  }

  for (let opt of opts) {
    let targetConfig = buildConfig(config, pkg, opt);
    let bundle = await rollup(targetConfig);

    await bundle.generate(targetConfig.output);
    await bundle.write(targetConfig.output);
  }
};
