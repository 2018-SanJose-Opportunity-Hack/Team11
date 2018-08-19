querystring = require('querystring');
http = require("http");
const gyft = require('../controllers/gyft');

module.exports = {
	payout: function(req, response) {
        var cardname = req.query.cardname;
        var cardtype = req.query.cardtype;
        var emailid = 'lifesaver@gmail.com';
        var shopid = {
			"amazon" : {
				"20" : 3664,
				"10" : 3462,
				"5" : 3425
			},
			"target" : {
				"20" : 4671,
				"10" : 4417,
				"5" : 4416
			},
			"walmart" : {
				"20" : 4651,
				"10" : 3942,
				"5" : 4665
			}
        }
        console.log('Process payment');
        console.log(cardname);
        console.log(shopid[cardname]['20']);
        console.log(cardtype);
        if (cardtype === 'giftcard') {
            console.log('=======');
            // req.http({ 
            //     method: 'GET',
            //     path: '/gyft?shopid='+ shopid[cardname]["20"] + '&emailid=' + emailid
            // }, function(res) {
            //     res.setEncoding('utf8');
            //     res.on('data', function (chunk) {
            //         console.log('Response: ' + chunk);
            //         // response.send(chunk);
            //         // response.redirect(chunk.website);
            //     });
            // });
            gyft.purchaseCard(shopid[cardname]["20"], emailid, response)
        } else { // card type is paypal
            
        }
    }
}