const handlers = require('./handlers')

// Define a request router
const router = module.exports = {
  hello: handlers.hello
};