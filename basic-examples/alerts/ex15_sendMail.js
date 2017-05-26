//https://nodemailer.com/about/
//http://masashi-k.blogspot.com.br/2013/06/sending-mail-with-gmail-using-xoauth2.html

const nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {        
        type: "XOAuth2",
        user: "kraken.trade@gmail.com", 
        clientId: '',
        clientSecret: '',
        refreshToken: ""        
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"KrakenTrade" <kraken.trade@gmail.com>', // sender address
    to: 'teste@hotmail.com', // list of receivers, separete with comma
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
  smtpTransport.close();
});
