mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/earn');
mongoose.Promise = global.Promise;