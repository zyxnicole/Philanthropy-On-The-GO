const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    inventory: './src/inventory.js',
    user: './src/users.js', 
    firebase: './src/firebase.js'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js'),
  },
};
