const contests = require('../controllers/contests');
const users = require('../controllers/users');
const gyft = require('../controllers/gyft');

module.exports = function(app) {
    // index page 
    app.get('/', function(req, res) {
        contests.index(req, res);
    });

    // about page 
    app.get('/payment', function(req, res) {
        contests.about(req, res);
    });


    // Gyft APIs
    app.get('/gyft', function (req, res) {
    	gyft.purchaseCard(req, res);
    });
}