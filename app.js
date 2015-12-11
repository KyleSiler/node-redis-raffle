var Hapi = require('hapi');
var server = new Hapi.Server();
var raffles = require('./raffles.js');

server.connection({
  host: 'localhost',
  port: 8080
});

server.route( {
  method: 'GET',
  path: '/raffles',
  handler: raffles.getRaffles
});

server.route( {
  method: 'GET',
  path: '/raffles/{id}',
  handler: raffles.getRaffleById
});

server.route( {
  method: 'POST',
  path: '/raffles',
  handler: raffles.createRaffle
});

server.route( {
  method: 'DELETE',
  path: '/raffles/{id}',
  handler: raffles.deleteRaffleById
});



server.start(function() {
  console.log('Server started');
});
