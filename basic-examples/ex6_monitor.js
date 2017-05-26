var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var BlinkTrade = new BlinkTradeRest({
  prod: true,
  currency: "BRL",
});
var cron = require('node-cron'); 

//Carrega valor da última ordem de compra


//Executa monitor para para buscar o ponto de venda
cron.schedule('*/5 * * * * *', function(){
  BlinkTrade.ticker().then(function(ticker) {
    console.log(ticker.last);
  });  
});  
