var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static('public'));

require('./server/config/mongoose.js');
require('./server/config/routes')(app);

app.listen(3000, function () {
  console.log('SimpleNodeServer is running on port 3000!');
});
