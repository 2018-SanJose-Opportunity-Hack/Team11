var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
  'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
});

// set the view engine to ejs
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'the_secret_key_hehe', resave: false, saveUninitialized: true, cookie: {maxAge : 60000}}));
app.use('/public', express.static('public'));

require('./server/config/mongoose.js');
require('./server/config/routes')(app);

app.listen(3000, function () {
  console.log('SimpleNodeServer is running on port 3000!');
});
