AlteraValorAlertConfig("-1");

function AlteraValorAlertConfig(novoValor){
    var fs = require('fs');
    var fileName = './config2.json';
    var file = require(fileName);
    file.alert = novoValor;
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err);
        //console.log(JSON.stringify(file));
        //console.log('writing to ' + fileName);
    });
}