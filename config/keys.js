if (process.env.NODE_ENV === 'production') {
  console.log("ENV: ", process.env.NODE_ENV);
  module.exports = require('./prod');
} else {
  console.log("ENV: ", process.env.NODE_ENV);
  module.exports = require('./dev');
}