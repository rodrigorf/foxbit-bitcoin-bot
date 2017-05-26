var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var BlinkTrade = new BlinkTradeRest({
  prod: true,
  currency: "BRL",
});

BlinkTrade.orderbook().then(function(orderbook) {
  console.log(orderbook);
});