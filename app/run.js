var fs = require('fs');
var util = require('./util.js');
var config = require('./config.json');
var secure = require('./credenciais.json');
var msg = require('./languages/lang_'+config.language+'.json');

var BlinkTradeWS = require("blinktrade").BlinkTradeWS;
var cron = require('node-cron'); 
var moment = require('moment'); 
var beeper = require('beeper');
var logger = require('winston');
logger.configure({
    transports: [
        new (logger.transports.Console)({ level: 'info' }),
        new (logger.transports.File)({ 
            filename: config.logFileName, 
            level: 'info'
        })
    ]
  });

var blinktrade = new BlinkTradeWS({ prod: true });
var params = {
    MsgType: "BE",
    UserReqID: 9696784,
    BrokerID: config.BrokerID,
    username: secure.username,
    password: secure.password,
    UserReqTyp: secure.UserReqTyp,
    FingerPrint: secure.FingerPrint
}

logger.info("=============================================");
blinktrade.connect().then(function() {    
    logger.info(msg.CONNECTION);
    return blinktrade.login(params);
}).then(function(logged) {
    logger.info(msg.USERNAME + ":" + logged.Username);
    logger.info("Broker:" + logged.Broker.BusinessName);
    
    var ultimaOrdem, valorComLucroDesejado;
    IniciaCiclo(); 

    var vendaEfetuada = false, compraEfetuada = false;         
    cron.schedule('*/'+config.monitorRefreshRate+' * * * * *', function(){   //SCHEDULER
        blinktrade.myOrders().then(function(myOrders) {
           ultimaOrdem = util.RetornaUltimaOrdem(myOrders);       
            if(ultimaOrdem.OrdStatus == '0'){
                logger.info(msg.ORDER_OP_WAIT);   
            }else{      
                blinktrade.subscribeTicker(["BLINK:BTCBRL"]).then(function(ticker) {  //TICKER
                    var mensagem = ""; 
                    if(ultimaOrdem.Side == TipoOrdem.COMPRA.value){ //SE ULTIMA ORDEM FOI UMA COMPRA
                        compraEfetuada = true;
                        vendaEfetuada = false;

                        //VERIFICA STOPLOSS
                        if(util.AtingiuStopLoss(ticker.LastPx, ultimaOrdem.Price)){
                            logger.info(msg.STOPLOSS_ALERT);   
                            ExecutaOrdem(TipoOrdem.VENDA.value, ticker.LastPx);
                            mensagem =  ("(${tipoOrd} "+msg.STOPLOSS_MSG+")").supplant({ tipoOrd: TipoOrdem.VENDA.name});
                            vendaEfetuada = true;     
                            compraEfetuada = false;
                            ultimaOrdem = util.RetornaUltimaOrdem(myOrders);
                        }else{                          
                            if(ticker.LastPx >= valorComLucroDesejado && vendaEfetuada == false){                                        
                                ExecutaOrdem(TipoOrdem.VENDA.value, ticker.LastPx);
                                mensagem = ("(${tipoOrd}"+msg.ORDER_ACTION+")").supplant({ tipoOrd: TipoOrdem.VENDA.name});
                                vendaEfetuada = true;     
                                compraEfetuada = false;
                                ultimaOrdem = util.RetornaUltimaOrdem(myOrders);
                                if(config.alert != "-1"){
                                    GravaValorAlertConfig(config, "-1");
                                    logger.info("config.alert:" + config.alert);
                                }
                            }
                        }
                    }else{ //SE A ULTIMA ORDEM FOI UMA VENDA
                        compraEfetuada = false;
                        vendaEfetuada = true;
                        if((ticker.LastPx <= valorComLucroDesejado) && compraEfetuada == false)
                        {
                            ExecutaOrdem(TipoOrdem.COMPRA.value, ticker.LastPx);
                            mensagem = ("(${tipoOrd} "+msg.ORDER_ACTION+")").supplant({ tipoOrd: TipoOrdem.COMPRA.name});
                            compraEfetuada = true; 
                            vendaEfetuada = false;     
                            ultimaOrdem = util.RetornaUltimaOrdem(myOrders);
                            if(config.alert != "-1")
                                GravaValorAlertConfig(config, "-1");
                        }                        
                    }  
                    
                    var variacao=util.CalculaPorcentagem(ticker.LastPx, ultimaOrdem.Price);
                    if(config.alert != -1)
                        valorComLucroDesejado = config.alert;
                    else
                        valorComLucroDesejado = AtualizaUltimaOrdem(ultimaOrdem, false);             

                    logger.info("[" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss") + "]" + " "+msg.CURRENT_PRICE+": R$" + ticker.LastPx +
                                                " - " + msg.PROFIT_GOAL  + ": R$" + valorComLucroDesejado + 
                                                " - " + msg.LAST_OP_EXEC + ":" + util.ConvertNumberToCurrency(ultimaOrdem.Price) + 
                                                " -> " + variacao + "%) " + 
                                                mensagem);              
                });//FIM TICKER
            } 
        }); //FIM MYORDERS     
    }); //FIM SCHEDULER              
});


function ExecutaOrdem(tipoOrdem, valorAtual){
    blinktrade.sendOrder({
        "side": tipoOrdem, // VENDA
        "price": parseInt((valorAtual * 1e8).toFixed(0)), //3573
        "amount": parseInt(((config.valorTransacao/valorAtual) * 1e8).toFixed(0)), //0.02798
        "BrokerID": config.BrokerID,
        "symbol": config.symbol,
    }).then(function(order) {
        var dataHora = "[" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss") + "]";
        var descricao = tipoOrdem == "1"?"COMPRADO":"VENDIDO" + " BTC$ " + order.OrderQty;
        var situacaoOrdem = order.OrdStatus;
        var precoBitcoin = "R$" + order.Price;
        var totalReais = "R$" + order.OrderQty * order.Price;
        logger.info(dataHora +" | "+ descricao +" | "+ situacaoOrdem +" | "+ precoBitcoin +" | "+ totalReais);
        beeper();
    });
}
function AtualizaUltimaOrdem(ultimaOrdem, flExibirMensagem){      
    var precoNum = util.ConvertNumberToCurrency(ultimaOrdem.Price);
    var tipoMsg = ultimaOrdem.Side == '1'? 'compra':'venda' ;
    if(flExibirMensagem){
        logger.info("Última " + tipoMsg + " efetuada: R$" + precoNum + "(Status:" + ultimaOrdem.OrdStatus + ")");
    }        
    return util.CalculaValorDesejado(ultimaOrdem.Price, ultimaOrdem.Side);
}

function IniciaCiclo(){
    blinktrade.myOrders().then(function(myOrders) {
        var valorComLucroDesejado;
        var ultimaOrdem = util.RetornaUltimaOrdem(myOrders);                 
        logger.info("=============================================");
        logger.info("---"+msg.START+"---");
        if(config.alert != -1)
            valorComLucroDesejado = config.alert;
        else
            valorComLucroDesejado = AtualizaUltimaOrdem(ultimaOrdem, true);
        logger.info(msg.PROFIT_GOAL + ": R$" + valorComLucroDesejado);       
    }); 
}

function GravaValorAlertConfig(configFile, novoValor){
    configFile.alert = novoValor;
    fs.writeFile('./config.json', JSON.stringify(configFile, null, 2), function (err) {
        if (err) {
            return logger.info((err));
        }            
    });
    logger.info("Alerta setado para -1.");
}