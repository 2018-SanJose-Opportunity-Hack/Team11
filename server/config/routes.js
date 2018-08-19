const contests = require('../controllers/contests');
const users = require('../controllers/users');
const gyft = require('../controllers/gyft');
const paypal = require('../controllers/paypal');
const processpayment = require('../controllers/processpayment');

path = require('path');
var multer = require('multer');
var upload = multer({storage: multer.diskStorage({

    destination: function (req, file, callback) 
    { callback(null, './public/uploads');},
    filename: function (req, file, callback) 
    { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}
  
  }),
  
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
  });

module.exports = function(app) {
    // login registration page
    app.get('/', function(req, res) {
        res.render('pages/index');
    });
    app.post('/', function(req, res){
        users.login(req,res);
    })
    // about page 
    app.get('/payment', function(req, res) {
        res.render('pages/payment');
    });
    // dashboard
    app.get('/dashboard', function(req, res) {
        contests.all_v2(req, res);
    });
    app.get('/dashboard/contests/:id', function(req, res) {
        contests.one_v2(req, res);
    });

    app.get('/dashboard/stats/:id', function(req, res) {
        contests.stats(req, res);
    });


    app.get('/dashboard/create_contest', function(req, res) {
        res.render('pages/create_contest');
    });

    app.get('/dashboard/create_contest_uploads', function(req, res) {
        res.render('pages/create_contest_uploads');
    });

    app.get('/contest', function(req, res) {
        res.render('pages/contest', {user: req.session.user, contest: req.session.contest, card_mark: 2});
    })
    app.get('/metrics', function(req,res) {
        res.render('pages/stats', {title: 'Metrics Baby!'});
    })
    app.get('/expire', function(req,res){
        res.render('pages/expire')
    })

    //----------API BELOW---------
    // For contests
    app.get('/contests', function(req, res) {
        contests.all(req, res);
    });
    app.get('/contests/:id', function(req, res) {
        //contests.one(req, res);
        console.log('came here');
        req.body = { id: "5b790b28ad668b1e4e5174d4" }
        users.make_win(req, res);
    });
    app.post('/contests', function(req, res) {
        contests.create(req, res);
    });

    //----with image uploads
    app.post('/contestsuploads', upload.any(), function(req, res) {
        console.log('-------- /contestuplods');
        console.log(req.files);

        contests.createuploads(req, res);
    });
    app.post('/contestsuploads/:id', upload.any(), function(req, res) {
        console.log('-------- /contestuplods/:id');
        contests.updateuploads(req, res);
    });
    //----

    app.post('/contests/:id', function(req, res) {
        console.log('here');
        contests.update(req, res);
    });
    app.delete('/contests/:id', function(req, res) {
        contests.remove(req, res);
    });
     // Gyft APIs
    app.get('/gyft', function (req, res) {
    	gyft.purchaseCard(req, res);
    });
    // Paypal instant pay
    app.get('/paypal', function (req, res) {
    	paypal.instapay(req, res);
    });
    app.get('/processpayment', function (req, res) {
        processpayment.payout(req, res)
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

