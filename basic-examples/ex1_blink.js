var BlinkTrade = require('blinktrade');

var BlinkTradeRest = BlinkTrade.BlinkTradeRest;
var BlinkTradeWS = BlinkTrade.BlinkTradeWS;

// REST Transport
var blinktrade = new BlinkTradeRest();

// WebSocket Transport
var blinktrade = new BlinkTradeWS();

blinktrade.heartbeat().then(function(heartbeat) {
  console.log(heartbeat.Latency);
});
