//key.js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  // in the development
  module.exports = require('./dev');
}