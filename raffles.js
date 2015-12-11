var Redis = require('redis');
var client = Redis.createClient();

client.on('error', function(err) {
   console.log('Error in Redis ' + err);
});

exports.getRaffles = function(request, reply) {
  client.zrange('raffles', 0, -1, function(err, raffles) {
    var result = [];
    var rafflesLeftToRetrieve = raffles.length;

    if(rafflesLeftToRetrieve == 0) {
      reply([]);
    }

    raffles.forEach(function(item) {
      client.hgetall(item, function(err, raffle) {
        result.push(raffle);

        if(--rafflesLeftToRetrieve == 0) {
          reply(result);
        }
      });
    });
  });
}

exports.getRaffleById = function(request, reply) {
  var raffleId = request.params.id;
  client.hgetall(raffleId, function(err, raffle) {
    reply(raffle);
  })
}

exports.createRaffle = function(request, reply) {
  var body = JSON.parse(request.payload);

  client.incr('raffleCount', function(err, count) {
    var raffleId = 'raffle:' + count;
    client.zadd('raffles', Date.now(), raffleId, function(err){
      var raffleUrl = 'http://localhost:8080/raffles/' + raffleId;
      var participantsUrl = raffleUrl + '/participants';
      var raffle = {'id':count, 'name':body.name, 'participants':participantsUrl, 'self':raffleUrl}
      client.hmset(raffleId, raffle, function(err) {
        client.expire(raffleId, 5);
        reply(raffle);
      })
    });
  });
}

exports.deleteRaffleById = function(request, reply) {
  var raffleId = request.params.id;
  client.zrem('raffles', raffleId, function(err, rowsDeleted) {
    client.del(raffleId, function(err, rafflesDeleted) {
      reply('Deleted ' + rafflesDeleted + ' rows');
    });
  })
}
