const contests = require('../controllers/contests');
const users = require('../controllers/users');
const gyft = require('../controllers/gyft');

module.exports = function(app) {
    // login registration page
    app.get('/', function(req, res) {
        res.render('pages/index');
    });
    // about page 
    app.get('/payment', function(req, res) {
        res.render('pages/payment');
    });
    // dashboard
    app.get('/dashboard', function(req, res) {
        const contests = contests.all(req, res);
        res.render('pages/dashboard', {contests});
    });
    app.get('/dashboard/create_contest', function(req, res) {
        res.render('pages/create_contest');
    });
    app.get('/contest', function(req, res) {
        res.render('pages/contest');
    })
    app.get('/win', function(req, res) {
        res.render('pages/win');
    });
    app.get('/lose', function(req, res) {
        res.render('pages/lose');
    });
    app.get('/expired', function(req, res) {
        res.render('pages/expired');
    });

    app.get('/metrics', function(req,res) {
        res.render('pages/metrics', {title: 'Metrics Baby!'});
    })

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
     // Gyft APIs
    app.get('/gyft', function (req, res) {
    	gyft.purchaseCard(req, res);
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
    app.put('/users/:id/eli', function(req, res) {
        users.make_win(req, res);
    });

}

