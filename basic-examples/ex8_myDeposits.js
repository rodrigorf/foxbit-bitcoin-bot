// REST Transport
var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var blinktrade = new BlinkTradeRest({
  prod: false,
  key: "",
  secret: "",
  currency: "BRL",
});

blinktrade.requestDepositList().then(function(deposits) {
  console.log(deposits);
});