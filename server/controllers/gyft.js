querystring = require('querystring');


module.exports = {
	purchaseCard: function(shop_card_id, to_email, response) {

		var apiKey = '48e30569-45d1-4ac9-b09e-08634e8a3dc1';
		var apiSecret = '5T#v(mg{TZ58Nxv';
		var timeStamp = Math.round(new Date().getTime() / 1000).toString();
		var stringToSign = apiKey + apiSecret + timeStamp;
		var sha256 = require('crypto').createHash('sha256');
		var signature = sha256.update(stringToSign).digest('hex');
		var http = require('http');
		
		var post_options = {
			hostname: 'apitest.gyft.com', 
			method: 'POST',
			path: '/mashery/v1/partner/purchase/gift_card_direct?&api_key=' + apiKey + '&sig=' + signature, 
			headers: {'x-sig-timestamp': timeStamp}
		};
		var postdata = querystring.stringify({
			shop_card_id : shop_card_id || 3425,
			to_email : to_email
		});
		console.log(postdata);
		// Set up the request
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Response: ' + chunk);
				var data = JSON.parse(chunk);
				console.log(data.url);
				// response.send(chunk);
				response.json(data.url);
			});
		});
		// post the data
		post_req.write(postdata);
		post_req.end();
	}
}

