var paypal = require('paypal-rest-sdk');

module.exports = {
    instapay: function(req, response) {

        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'AbEhgfPac5LQ7oGefSja6f6zz1GOntIStvWOAfwRNHfMchRiSfcTtklupbXQC3NYGzsmVVbPqQyR8f_3',
            'client_secret': 'EBg9VrKzfEqMRdT2jM_nbybR7XOtUkxmtm5yiONpx6GfLalRjVYzpQOnV-xDdx4ztylGoMbwcul3oJOd',
            'headers' : {
                'custom': 'header'
            }
        });

        var sender_batch_id = Math.random().toString(36).substring(9);
        var receiveremail = req.query.emailid || 'avinash707@gmail.com';

        var create_payout_json = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id,
                "email_subject": "Congrats! You are this week's winner."
            },
            "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": 1.00,
                    "currency": "USD"
                },
                "receiver": receiveremail,
                "note": "$5 has been ",
                "sender_item_id": "item_3"
            }
            ]
        };

        var sync_mode = 'false';

        paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
            if (error) {
                console.log(error.response);
            } else {
                console.log("Create Single Payout Response");
                console.log(payout);
            }
        });

    }
}