require('../models/contest.js');

module.exports = {
    index: function(req, res) {
        res.render('pages/');
    },
    about: function(req, res) {
        res.render('pages/payment');
    }
}