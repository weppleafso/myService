var pomelo = require('pomelo');
var routeUtil = require('./util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'Hello');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : false,
      useProtobuf : false
    });
});

app.configure('production|development', 'gate', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : false,
      useProtobuf : false
    });
});

// app.configure('production|development',function(){
//   app.route("chat",routeUtil.chat)
// })

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
