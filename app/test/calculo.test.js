var util = require('../util.js');
var mock = require('./mocks.js');

QUnit.module( "Funções Básicas", function() {
  QUnit.test( "ConvertNumberToCurrencyInteger", function( assert ) {
    var entrada = 3566
    var expected = 3566.00;
    var result = util.ConvertNumberToCurrency(entrada);
    assert.ok(expected == result, "Passed!" );  
  });

  QUnit.test( "ConvertNumberToCurrencyDecimal", function( assert ) {
    var entrada = 356201000000;
    var expected = 3562.01;
    var result = util.ConvertNumberToCurrency(entrada);
    assert.ok(expected == result, "Passed!" );  
  });

  QUnit.test( "CalculaPorcentagemInteiro", function( assert ) {
    var entrada1 = 3562;
    var entrada2 = 3489;
    var expected = 2.05;
    var result = util.CalculaPorcentagem(entrada1,entrada2);
    assert.equal(expected, result, "A porcentagem calculada está correta." );  
  });

  QUnit.test( "CalculaPorcentagemDecimal", function( assert ) {
    var entrada1 = 3563.14;
    var entrada2 = 3489.88;
    var expected = 2.08;
    var result = util.CalculaPorcentagem(entrada1,entrada2);
    assert.equal(expected, result, "A porcentagem calculada está correta." );  
  });

  QUnit.test( "CalculaPorcentagemDecimalNegativa", function( assert ) {
    var entrada1 = 3489.88;
    var entrada2 = 3563.14;
    var expected = -2.10;
    var result = util.CalculaPorcentagem(entrada1,entrada2);
    assert.equal(expected, result, "A porcentagem calculada está correta." );  
  });
});

QUnit.module( "Funções BlinktradeDependent", function() {
  QUnit.test( "AtingiuStopLoss", function( assert ) {    
    var ultimaCotacao = 2489.88; //ticker.Lastpx
    var ultimaOrdemExecutada = 3230.55; //ultimaOrdem
    var result = util.AtingiuStopLoss(ultimaCotacao, ultimaOrdemExecutada);
    assert.ok(result, "Stoploss registrado com sucesso" );  
  });
});



