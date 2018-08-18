const contests = require('../controllers/contests');
const users = require('../controllers/users');

module.exports = function(app) {
    // index page 
    app.get('/', function(req, res) {
        res.render('pages/');
    });
    // about page 
    app.get('/payment', function(req, res) {
        res.render('pages/payment');
    });

    //----------API BELOW---------
    // For contests
    app.get('/contests', function(req, res) {
        contests.all(req, res);
    });
    app.get('/contests/:id', function(req, res) {
        contests.one(req, res);
    });
    app.post('/contests', function(req, res) {
        contests.create(req, res);
    });
    app.put('/contests/:id', function(req, res) {
        contests.update(req, res);
    });
    app.delete('/contests/:id', function(req, res) {
        contests.remove(req, res);
    });
    
    // For users
    app.get('/users', function(req, res) {
        users.all(req, res);
    });
    app.get('/users/:id', function(req, res) {
        users.one(req, res);
    });
    app.post('/users', function(req, res) {
        users.create(req, res);
    });
    app.put('/users/:id', function(req, res) {
        users.update(req, res);
    });
    app.delete('/users/:id', function(req, res) {
        users.remove(req, res);
    });

}