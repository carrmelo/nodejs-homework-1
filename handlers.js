//Define handlers and routes

const handlers = module.exports = {};

// Hello handler
handlers.hello = function(data, callback) {
  // Callback a http status code with the hello message
  callback(200, { message: 'Start your engines and may the best woman win' });
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(400);
};