
var config = require('./config.json');
TipoOrdem = {
  COMPRA : {value: "1", name: "Compra", code: "C"}, 
  VENDA: {value: "2", name: "Venda", code: "V"}
};

String.prototype.supplant = function (o) {
    return this.replace(/\${([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

module.exports = {
  RetornaDescricaoStatusOrdem: function (tipo) {
    return tipo=='2' ? 'Executada' : 'Pendente ';    
  },
  RetornaDescricaoTipoOrdem: function (tipo) {
    return tipo=='1' ? 'Compra' : 'Venda ';    
  },

  RetornaUltimaOrdem: function (ordens) {
    return ordens.OrdListGrp[0];    
  },
  RetornaUltimaCompra: function (ordens) {
    var arrayOrdens = ordens.OrdListGrp;
    for (var i = 0; i < arrayOrdens.length; i++) {
        if(arrayOrdens[i].Side == '1'){
        return arrayOrdens[i];
        }
    }
  },
  
  ConvertNumberToCurrency: function (num) {
    var str = num.toString().substr(0,6);
    str = str.slice(0, 5) + "." + str.slice(5);
    return parseFloat(str).toFixed(2);
  },
  CalculaValorDesejado: function (precoUltimaOrdem, tipoOp) {
    var delta=0;
    var precoNum = module.exports.ConvertNumberToCurrency(precoUltimaOrdem);   
    if(tipoOp == '1'){ //ULTIMA FOI UMA COMPRA
      delta = ((config.valorPercentualLucroVenda/100) * precoNum);
      return (Number(precoNum) + Number(delta)).toFixed(2);
    }else{
      delta = ((config.valorPercentualLucroCompra/100) * precoNum);
      return (Number(precoNum) - Number(delta)).toFixed(2);
    }
  },
  CalculaPorcentagem: function(valorAtual, valorUltimaOrdem)
  {
    var precoNum = module.exports.ConvertNumberToCurrency(valorUltimaOrdem);
    var res= ((Number(valorAtual)-Number(precoNum))/Number(valorAtual))*100;
    return res.toFixed(2);
  },
  
  /**
   * Verifica se o ponto de ruptura do stop loss foi atingido
   * 
   * @param {any} valorAtual 
   * @param {any} valorUltimaOrdemCompra 
   * @returns true se atingiu, e não caso contrário
   */

  /**
   * Verifica se o último valor capturado do bitcoin ultrapassou o limite
   * de perda(%) configurado no config(percentualStopLoss)
   * @param {any} valorAtual 
   * @param {any} valorUltimaOrdemCompra 
   * @returns 
   */
  AtingiuStopLoss: function(valorAtual, valorUltimaOrdemCompra)
  {
    var precoNum = module.exports.ConvertNumberToCurrency(valorUltimaOrdemCompra);
    var res= ((Number(valorAtual)-Number(precoNum))/Number(valorAtual))*100;
    return (valorAtual < precoNum) && (Math.abs( res.toFixed(2) ) >= config.percentualStopLoss);
  }
};
