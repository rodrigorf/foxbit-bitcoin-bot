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
    FingerPrint: "b959a35c7f3f5e9315c99b5a25c2bbda"
}

blinktrade.connect().then(function() {
    console.log("Conectado com sucesso!");
    return blinktrade.login(params);
}).then(function(logged) {
    blinktrade.requestWithdraw({
        "amount": parseInt(100 * 1e8),
        "currency": "BRL",
        "method": "bb",
        "data": {
            "AccountBranch": "", //agnecia
            "AccountNumber": "", //conta corrente
            "AccountType": "corrente",
            "CPF_CNPJ": ""
    }
    }).then(function(withdraw) {
        console.log(withdraw);
    });
});