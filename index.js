// Primary file for Hello World API
// by car aka carrmelo

// Node.js Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const router = require('./router');
const handlers = require('./handlers');

// Instantiate HTTP server
const server = http.createServer((req, res) => {
  // Get the URL and parse it   >>>>>> true calls the query string module
  const parsedUrl = url.parse(req.url, true);

  // Get the untrimmed path and then trimms backlash at the beggining and end
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object from the parsedUrl
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method and leaves it in uppercase
  const method = req.method;

  // Get the header as an object from the request
  const headers = req.headers;

  // Get the payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Choose handler for request, if no handler it goes to notFound
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the specified handler
    chosenHandler(data, (statusCode, payload) => {
      // Use the specified status code or defaults to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or defaults to an empty object
      payload = typeof payload === 'object' ? payload : {};

      // Stringify the payload
      const payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response and payload
      console.log(`Returning this response ${statusCode} / ${payloadString}`);
    });
  });
});

// Start HTTP server
server.listen(3000, () => console.log(`Server listening in port 3000`));
