var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
       return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

fs.readdirSync('node_modules/@dra2020')
  .forEach((mod) => {
    mod = '@dra2020/' + mod;
    nodeModules[mod] = 'commonjs ' + mod;
  });

var libConfig = {
    entry: {
      library: './lib/all.ts'
	  },
    target: 'node',
    mode: 'development',
    output: {
        library: 'dra-types',
        libraryTarget: 'umd',
        path: __dirname + '/dist',
        filename: 'dra-types.js'
    },

    // Enable source maps
    devtool: "source-map",

    externals: nodeModules,

    module: {
		rules: [
			{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, enforce: "pre", loader: "source-map-loader" }
		]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }

};

module.exports = [ libConfig ];
