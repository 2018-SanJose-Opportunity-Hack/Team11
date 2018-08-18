const contests = require('../controllers/contests');
const users = require('../controllers/users');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('pages/index')
    });
    app.get('/dashboard', function(req, res){
        res.render('pages/dashboard');
    })
    app.get('/dashboard/createcontest', function(req, res){
        res.render('pages/create_contest');
    })
    app.get('dashboard/contest/:id', function(req, res){
        res.render('admin_contest');
    })
    app.get('contest/:id', function(req, res){
        res.render('user_contest');
    })
    app.get('/payment', function(req, res) {
        res.render('payment');
    });
}