const { createBaseWebpackConfig, createUMDExternal, createUMDLibraryDefinition, getPaths } = require('@misonou/build-utils');
const paths = getPaths();

module.exports = {
    ...createBaseWebpackConfig(),
    entry: {
        'zeta': './src/index.js',
        'zeta.min': './src/index.js',
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: createUMDLibraryDefinition('zeta-dom', 'zeta')
    },
    externals: {
        'jquery': createUMDExternal('jquery', 'jQuery')
    }
};
