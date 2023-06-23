const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // Other configuration options...

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new Dotenv()
  ],

};