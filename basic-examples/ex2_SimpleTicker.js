var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var BlinkTrade = new BlinkTradeRest({
  prod: true,
  currency: "BRL",
});

var cron = require('node-cron'); 
cron.schedule('*/5 * * * * *', function(){
  BlinkTrade.ticker().then(function(ticker) {
    console.log(ticker);
  });  
});  
