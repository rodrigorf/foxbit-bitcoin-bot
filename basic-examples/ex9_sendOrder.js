// REST Transport
var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var blinktrade = new BlinkTradeRest({
  prod: false,
  key: "",
  secret: "",
  currency: "BRL",
});

blinktrade.sendOrder({
  "side": "1", // Buy
  "price": parseInt((550 * 1e8).toFixed(0)),
  "amount": parseInt((0.05 * 1e8).toFixed(0)),
  "symbol": "BTCBRL",
}).then(function(order) {
  console.log(order);
});
