var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    chunkModules: false,
    colors: true
  }
}).listen(port, '127.0.0.1', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 127.0.0.1:' + port);
});
