mongoose = require('mongoose');
mongoose.connect('mongodb://earnhack:Hack4Good@ds225902.mlab.com:25902/scratchexpress');
mongoose.Promise = global.Promise;