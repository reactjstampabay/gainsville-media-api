'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const log = require('winston');
const bootstrap = require('./bootstrap');
const AWSService = require('./services/AWSService');
const AuthService = require('./services/AuthService');

server.connection({ port: process.env.PORT || 1338 });

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply({message: 'Gainsville Media API'});
  }
});

// A quick route to proxy in media
server.route({
  method: 'POST',
  path: '/media/upload',
  handler: function(request, reply) {
    // Validate the jwt and upload the photo
    AWSService.upload(request.payload.media)
      .then(function(response) {
        return reply(response);
      })
      .catch(function(err) {
        return reply(err).code(401);
      });
  },
  config: {
    cors: {
      origin: ['*']
    },
    payload: {
      maxBytes: 52428800
    }
  }
});


// Start the server
bootstrap.initialize()
  .then(function(infrastructure) {
    global.infrastructure = infrastructure;
    server.start(() => {
      log.info('Server running at:', server.info.uri);
    });
  })
  .catch(function(err) {
    log.error(JSON.stringify(err));
  });


