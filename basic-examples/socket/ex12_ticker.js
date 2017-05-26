var BlinkTradeWS = require("blinktrade").BlinkTradeWS;
var blinktrade = new BlinkTradeWS({ prod: true });

var params = {
    MsgType: "BE",
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
        blinktrade.subscribeTicker(["BLINK:BTCBRL"]).then(function(ticker) {
            console.log(ticker);
        });
    });

