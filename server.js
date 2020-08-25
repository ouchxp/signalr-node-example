var express = require('express');
var cors = require('cors')
var SignalRJS = require('./signalr-server/lib/signalRJS');
 
//Init SignalRJs
var signalR = SignalRJS();
 
//Create the hub connection
//NOTE: Server methods are defined as an object on the second argument

const send = (hub, eventType) => (message, args) => signalR.broadcast({...message, H: hub, M: eventType, A: args, S: 1});

signalR.hub('eventHubLocal',{
    sendLiveEvent: send('eventHubLocal', 'liveEvents'),
    subscribeToLiveEvents: function() {
        console.log('subscribed to liveEvents');
        setInterval(() => this.sendLiveEvent({ time: Date.now() }), 1000);
    }
});
 
var server = express();
server.use(cors({
  credentials: true,
  origin: function(origin, callback) {
      callback(null, true)
  }
}));
server.use(express.static(__dirname));
server.use(signalR.createListener())
server.listen(8080);
