var util = require('../app/util.js');

var BlinkTradeWS = require("blinktrade").BlinkTradeWS;
var blinktrade = new BlinkTradeWS({ prod: true });
var params = {
    MsgType: "U4",
    UserReqID: 9696784,
    BrokerID: 4,
    username: "",
    password: "",
    UserReqTyp: "1",
    FingerPrint: ""
}

blinktrade.connect().then(function() {
    console.log("Conectado com sucesso!");
    return blinktrade.login(params);
}).then(function(logged) {
    blinktrade.myOrders().then(function(myOrders) {
        var array = myOrders["OrdListGrp"];
        console.log(array.length);
        for (var i = 0; i < array.length; i++) {
            console.log(array[i]["OrderDate"] + "  " + util.RetornaDescricaoTipoOrdem(array[i]["Side"]) +
                         "  R$" + util.ConvertNumberToCurrency(array[i]["Price"]) + " " + 
                         util.RetornaDescricaoStatusOrdem(array[i]["OrdStatus"]) + " " + array[i]["Volume"]);
        }             
    });
});