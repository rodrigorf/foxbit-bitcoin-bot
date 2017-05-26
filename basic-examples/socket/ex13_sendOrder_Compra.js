var BlinkTradeWS = require("blinktrade").BlinkTradeWS;
var blinktrade = new BlinkTradeWS({ prod: true });
var params = {
    MsgType: "BE",
    UserReqID: 9696784,
    BrokerID: 4,
    username: "",
    password: "",
    UserReqTyp: "1",
    FingerPrint: "b959a35c7f3f5e9315c99b5a25c2bbda"
}

blinktrade.connect().then(function() {
console.log("conectado com sucesso!");
return blinktrade.login(params);
}).then(function(logged) {
    blinktrade.sendOrder({
        "side": "2", // VENDA
        "price": parseInt((3580 * 1e8).toFixed(0)),
        "amount": parseInt((0.02793 * 1e8).toFixed(0)),
        "BrokerID": 4,
        "symbol": "BTCBRL",
    }).then(function(order) {
        console.log(order);
    });
});