require('../models/contest.js');
var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "saverlife.info@gmail.com",
      pass: "hack4good11!"
  }
});

module.exports = {
    all: function(req, res){
        Contest.find({}).sort('createdAt').exec(function(err, contests){
            if(err){
                console.log('Something went wrong when getting all contests');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: contests});
            }
        });
    },
    all_v2: function(req, res){
        Contest.find({}).sort('createdAt').exec(function(err, contests){
            if(err){
                console.log('Something went wrong when getting all contests');
                return({message: 'Error', error: err});
            }else{
                console.log(contests)
                // return({message: 'Success', data: contests});
                res.render('pages/dashboard', {message: 'Success', data: contests});
            }
        });
    },
    one: function(req, res){
        Contest.findOne({_id: req.params.id}, function(err, contest){
            if(err){
                console.log('Something went wrong when getting a single contest');
                res.json({message: 'Error', error: err});
            }else{
                req.session.contest = contest;
                res.redirect('/contest');
            }
        });
    },
    one_v2: function(req, res){
        Contest.findOne({_id: req.params.id}, function(err, contest){
            if(err){
                console.log('Something went wrong when getting a single contest');
                res.json({message: 'Error', error: err});
            }else{
                var start_date = new Date(contest.start_date);
                var end_date = new Date(contest.end_date);

                // console.log("ori start_date=" + contest.start_date);
                // console.log('end_date=' + end_date.toISOString());
                // console.log('end_date split=' + end_date.toISOString().split(".")[0]);

                start_date = start_date.toISOString().split(".")[0];
                end_date = end_date.toISOString().split(".")[0];

                // console.log('---contest=' + contest);
                console.log(req.session.user);
                res.render('pages/contest_detail_uploads', {message: 'Success', data: contest, start_date, end_date});
            }
        });
    },
    stats: function(req, res){
        Contest.findOne({_id: req.params.id}, function(err, contest){
            if(err){
                console.log('Something went wrong when getting a single contest');
                res.json({message: 'Error', error: err});
            }else{
                res.render('pages/stats', {message: 'Success', data: contest });
            }
        });
    },
    create: function(req, res){
        console.log('----req.body.start_date');
        console.log(req.body.start_date);
        console.log('----req.body.end_date');
        console.log(req.body.end_date);
        console.log('----');

        const today = new Date(); 
        const after_week = new Date(today.getDate() + 7);
        //const contest = { max_winners: req.body.max_winners, time_period: { start_date: today, end_date: after_week }};

        const contest = {
            title: req.body.title,
            max_winners: req.body.max_winners,
            winner_cards: [
                { 
                    title: req.body.winnercard1_title,
                    content: req.body.winnercard1_content,
                    img_url: req.body.winnercard1_image,
                    value: req.body.winnercard1_value
                },
                { 
                    title: req.body.winnercard2_title,
                    content: req.body.winnercard2_content,
                    img_url: req.body.winnercard2_image,
                    value: req.body.winnercard2_value
                },
                { 
                    title: req.body.winnercard3_title,
                    content: req.body.winnercard3_content,
                    img_url: req.body.winnercard3_image,
                    value: req.body.winnercard3_value
                },
            ],
            loser_card: {
                title: req.body.losercard_title,
                content: req.body.losercard_content,
                img_url: req.body.losercard_image,
            },
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
        };
        console.log('contest===');
        console.log(contest);
        Contest.create(contest, function(err){
            if(err){
                console.log('Something went wrong when creating a contest, detail: ', err);
                res.json({message: 'Error', error: err});   
            }else{
                res.redirect('/contests');
            }
        });
    },
    createuploads: function(req, res){
        console.log('----req.body.start_date');
        console.log(req.body.start_date);
        console.log('----req.body.end_date');
        console.log(req.body.end_date);
        console.log('----');

        const today = new Date(); 
        const after_week = new Date(today.getDate() + 7);
        //const contest = { max_winners: req.body.max_winners, time_period: { start_date: today, end_date: after_week }};

        const contest = {
            title: req.body.title,
            max_winners: req.body.max_winners,
            winner_cards: [
                { 
                    title: req.body.winnercard1_title,
                    content: req.body.winnercard1_content,
                    img_url: req.files[1].filename,
                    value: req.body.winnercard1_value
                },
                { 
                    title: req.body.winnercard2_title,
                    content: req.body.winnercard2_content,
                    img_url: req.files[2].filename,
                    value: req.body.winnercard2_value
                },
                { 
                    title: req.body.winnercard3_title,
                    content: req.body.winnercard3_content,
                    img_url: req.files[3].filename,
                    value: req.body.winnercard3_value
                },
            ],
            loser_card: {
                title: req.body.losercard_title,
                content: req.body.losercard_content,
                img_url: req.files[0].filename,
            },
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
        };
        console.log('contest===');
        console.log(contest);
        Contest.create(contest, function(err){
            if(err){
                console.log('Something went wrong when creating a contest, detail: ', err);
                res.json({message: 'Error', error: err});   
            }else{
                res.redirect('/dashboard');
            }
        });
    },
    sendingmail: function(req, res){

        // const csvFilePath='public/uploads/' + req.files[0].filename
        const csvFilePath=req.files[0].path;
        console.log("path ="+csvFilePath);
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            console.log(jsonObj);
            console.log('---');

            for(i in jsonObj) {
                console.log(jsonObj[i]);
                console.log(jsonObj[i].emailid);
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: "SaverLife ✔ <saverlife.info@gmail.com>", // sender address
                    to: String("" + jsonObj[i].emailid), // list of receivers
                    subject: "SaverLife : Scratch to win.", // Subject line
                    text: "Click link below to scratch to win", // plaintext body
                    html: '<!doctype html><html xmlns=http://www.w3.org/1999/xhtml xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><head><!--[if gte mso 15]><xml><o:officedocumentsettings><o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><meta charset=UTF-8><meta content="IE=edge"http-equiv=X-UA-Compatible><meta content="width=device-width,initial-scale=1"name=viewport><title>Scratch and Win!</title><style>p{margin:10px 0;padding:0}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0}a img,img{border:0;height:auto;outline:0;text-decoration:none}#bodyCell,#bodyTable,body{height:100%;margin:0;padding:0;width:100%}.mcnPreviewText{display:none!important}#outlook a{padding:0}img{-ms-interpolation-mode:bicubic}table{mso-table-lspace:0;mso-table-rspace:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}a,blockquote,li,p,td{mso-line-height-rule:exactly}a[href^=sms],a[href^=tel]{color:inherit;cursor:default;text-decoration:none}a,blockquote,body,li,p,table,td{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}#bodyCell{padding:10px}.templateContainer{max-width:600px!important;border:0}a.mcnButton{display:block}.mcnImage,.mcnRetinaImage{vertical-align:bottom}.mcnTextContent{word-break:break-word}.mcnTextContent img{height:auto!important}.mcnDividerBlock{table-layout:fixed!important}#bodyTable,body{background-color:#}#bodyCell{border-top:0}.templateContainer{border:0}h1{color:#202020;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:26px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h2{color:#202020;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:22px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h3{color:#202020;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:20px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h4{color:#202020;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:18px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}#templatePreheader{background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:9px}#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:left}#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{color:#656565;font-weight:400;text-decoration:underline}#templateHeader{background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0}#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left}#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{color:#2baadf;font-weight:400;text-decoration:underline}#templateBody{background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:4px solid #d99cc6;padding-top:0;padding-bottom:9px}#templateBody .mcnTextContent,#templateBody .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left}#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{color:#ac2189;font-weight:400;text-decoration:none}#templateFooter{background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px}#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{color:#414042;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:12px;line-height:150%;text-align:center}#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{color:#d99cc6;font-weight:400;text-decoration:underline}@media only screen and (min-width:768px){.templateContainer{width:600px!important}}@media only screen and (max-width:480px){a,blockquote,body,li,p,table,td{-webkit-text-size-adjust:none!important}}@media only screen and (max-width:480px){body{width:100%!important;min-width:100%!important}}@media only screen and (max-width:480px){#bodyCell{padding-top:10px!important}}@media only screen and (max-width:480px){.mcnRetinaImage{max-width:100%!important}}@media only screen and (max-width:480px){.mcnImage{width:100%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer,.mcnCaptionBottomContent,.mcnCaptionLeftImageContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightImageContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionTopContent,.mcnCartContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightImageContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageGroupContentContainer,.mcnRecContentContainer,.mcnTextContentContainer{max-width:100%!important;width:100%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer{min-width:100%!important}}@media only screen and (max-width:480px){.mcnImageGroupContent{padding:9px!important}}@media only screen and (max-width:480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px!important}}@media only screen and (max-width:480px){.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnImageCardTopImageContent{padding-top:18px!important}}@media only screen and (max-width:480px){.mcnImageCardBottomImageContent{padding-bottom:9px!important}}@media only screen and (max-width:480px){.mcnImageGroupBlockInner{padding-top:0!important;padding-bottom:0!important}}@media only screen and (max-width:480px){.mcnImageGroupBlockOuter{padding-top:9px!important;padding-bottom:9px!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentColumn,.mcnTextContent{padding-right:18px!important;padding-left:18px!important}}@media only screen and (max-width:480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px!important;padding-bottom:0!important;padding-left:18px!important}}@media only screen and (max-width:480px){.mcpreview-image-uploader{display:none!important;width:100%!important}}@media only screen and (max-width:480px){h1{font-size:22px!important;line-height:125%!important}}@media only screen and (max-width:480px){h2{font-size:20px!important;line-height:125%!important}}@media only screen and (max-width:480px){h3{font-size:18px!important;line-height:125%!important}}@media only screen and (max-width:480px){h4{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{font-size:14px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templatePreheader{display:block!important}}@media only screen and (max-width:480px){#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{font-size:14px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateBody .mcnTextContent,#templateBody .mcnTextContent p{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{font-size:14px!important;line-height:150%!important}}</style><body style=height:100%;margin:0;padding:0;width:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#><!--[if !gte mso 9]><!----><span style=display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all class=mcnPreviewText>*|MC_PREVIEW_TEXT|*</span><!--<![endif]--><center><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin:0;padding:0;width:100%;background-color:# width=100% align=center height=100% id=bodyTable><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin:0;padding:10px;width:100%;border-top:0 valign=top align=center id=bodyCell><!--[if (gte mso 9)|(IE)]><table border=0 cellpadding=0 cellspacing=0 style=width:600px width=600 align=center><tr><td style=width:600px valign=top align=center width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border:0;max-width:600px!important width=100% class=templateContainer><tr><td style="background:#transparent none no-repeat center/cover;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:9px"valign=top id=templatePreheader><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnImageBlock><tbody class=mcnImageBlockOuter><tr><td style=padding:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnImageBlockInner><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnImageContentContainer align=left><tr><td style=padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnImageContent><a href=https://www.saverlife.org/ style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://gallery.mailchimp.com/731e5188a2fdf37339343d51a/images/d5b47e77-728b-4c71-8894-c47b0ba49e3a.png style=max-width:200px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=200 align=center alt="SaverLife Logo"class=mcnImage></a></table></table><tr><td style="background:#transparent none no-repeat center/cover;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"valign=top id=templateHeader><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnImageBlock><tbody class=mcnImageBlockOuter><tr><td style=padding:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnImageBlockInner><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnImageContentContainer align=left><tr><td style=padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnImageContent><a href="https://scratchexpress.herokuapp.com/contests/5b790727ee9a98373ccbfa74"style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://gallery.mailchimp.com/731e5188a2fdf37339343d51a/images/74f34259-bd3d-4005-affc-8209a082b937.jpg style=max-width:480px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=480 align=center alt=""class=mcnImage></a></table></table><tr><td style="background:#transparent none no-repeat center/cover;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:4px solid #d99cc6;padding-top:0;padding-bottom:9px"valign=top id=templateBody><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextBlock><tbody class=mcnTextBlockOuter><tr><td style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnTextBlockInner><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 style=width:100% width=100% align=left><tr><![endif]--><!--[if mso]><td style=width:600px valign=top width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextContentContainer align=left><tr><td style="padding:0 18px 9px;font-family:Tahoma,Verdana,Segoe,sans-serif;text-align:left;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#202020;font-size:16px;line-height:150%"valign=top class=mcnTextContent><p style="font-family:Tahoma,Verdana,Segoe,sans-serif;text-align:left;margin:10px 0;padding:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#202020;font-size:16px;line-height:150%">Hi *|FNAME|*,<br><br>Congratulations on saving at least $*|MMERGE16|* this week! Will you win an extra $*|MMERGE16|*?</table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnButtonBlock><tbody class=mcnButtonBlockOuter><tr><td style=padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnButtonBlockInner align=center><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:separate!important;border-radius:3px;background-color:#ac2189;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnButtonContentContainer><tr><td style=font-family:Arial;font-size:16px;padding:15px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle class=mcnButtonContent align=center><a href="https://scratchexpress.herokuapp.com/contests/5b790727ee9a98373ccbfa74"style=font-weight:700;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#fff;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;display:block target=_blank class=mcnButton title="Play Scratch and Save">Play Scratch and Save</a></table></table><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextBlock><tbody class=mcnTextBlockOuter><tr><td style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnTextBlockInner><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 style=width:100% width=100% align=left><tr><![endif]--><!--[if mso]><td style=width:600px valign=top width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextContentContainer align=left><tr><td style="padding:0 18px 9px;font-family:Tahoma,Verdana,Segoe,sans-serif;text-align:left;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#202020;font-size:16px;line-height:150%"valign=top class=mcnTextContent><p style="font-family:Tahoma,Verdana,Segoe,sans-serif;text-align:left;margin:10px 0;padding:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#202020;font-size:16px;line-height:150%">For the next seven weeks, you can play Scratch and Save every week that you save at least $5 in the account you have linked to SaverLife. And remember, the more you save, the more you can win!<br><br>Happy saving!<br>Iraz</table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextBlock><tbody class=mcnTextBlockOuter><tr><td style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnTextBlockInner><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 style=width:100% width=100% align=left><tr><![endif]--><!--[if mso]><td style=width:600px valign=top width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextContentContainer align=left><tr><td style="padding:0 18px 9px;font-family:Tahoma,Verdana,Segoe,sans-serif;line-height:100%;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#202020;font-size:16px"valign=top class=mcnTextContent><p style="text-align:center;font-family:Tahoma,Verdana,Segoe,sans-serif;line-height:100%;margin:10px 0;padding:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#202020;font-size:16px"><span style=font-size:11px>Deadline to play this week’s game is 8/19/18 at 11:59:59am PT.</span></table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table><tr><td style="background:#transparent none no-repeat center/cover;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px"valign=top id=templateFooter><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowBlock><tbody class=mcnFollowBlockOuter><tr><td style=padding:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnFollowBlockInner align=center><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContentContainer><tr><td style=padding-left:9px;padding-right:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=center><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContent><tr><td style=padding-top:9px;padding-right:9px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top align=center><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=center><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top align=center><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 align=center><tr><![endif]--><!--[if mso]><td align=center valign=top><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=left><tr><td style=padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnFollowContentItemContainer><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContentItem><tr><td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=""align=left><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle class=mcnFollowIconContent align=center width=24><a href=https://www.facebook.com/SaverLife.org/ style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/gray-facebook-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=24 height=24></a></table></table></table><!--[if mso]><![endif]--><!--[if mso]><td align=center valign=top><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=left><tr><td style=padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnFollowContentItemContainer><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContentItem><tr><td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=""align=left><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle class=mcnFollowIconContent align=center width=24><a href=https://twitter.com/saverlifeorg style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/gray-twitter-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=24 height=24></a></table></table></table><!--[if mso]><![endif]--><!--[if mso]><td align=center valign=top><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=left><tr><td style=padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnFollowContentItemContainer><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContentItem><tr><td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=""align=left><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle class=mcnFollowIconContent align=center width=24><a href=http://www.saverlife.org style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/gray-link-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=24 height=24></a></table></table></table><!--[if mso]><![endif]--><!--[if mso]><td align=center valign=top><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=left><tr><td style=padding-right:0;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnFollowContentItemContainer><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnFollowContentItem><tr><td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left><table border=0 cellpadding=0 cellspacing=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=""align=left><tr><td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle class=mcnFollowIconContent align=center width=24><a href=http://instagram.com/saverlifeorg style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% target=_blank><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/gray-instagram-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=24 height=24></a></table></table></table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table></table></table></table><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextBlock><tbody class=mcnTextBlockOuter><tr><td style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnTextBlockInner><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 style=width:100% width=100% align=left><tr><![endif]--><!--[if mso]><td style=width:600px valign=top width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextContentContainer align=left><tr><td style=padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#414042;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:12px;line-height:150%;text-align:center valign=top class=mcnTextContent><em>Copyright © *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em><br>*|IFNOT:ARCHIVE_PAGE|* *|LIST:DESCRIPTION|*<br><br><strong>Our mailing address is:</strong><br>*|HTML:LIST_ADDRESS_HTML|* *|END:IF|*<br><br>Want to change how you receive these emails?<br>You can <a href=*|UPDATE_PROFILE|* style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#d99cc6;font-weight:400;text-decoration:underline>update your preferences</a> or <a href=*|UNSUB|* style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#d99cc6;font-weight:400;text-decoration:underline>unsubscribe from this list</a><br><br>*|IF:REWARDS|* *|HTML:REWARDS|* *|END:IF|*</table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table><table border=0 cellpadding=0 cellspacing=0 style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextBlock><tbody class=mcnTextBlockOuter><tr><td style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top class=mcnTextBlockInner><!--[if mso]><table border=0 cellpadding=0 cellspacing=0 style=width:100% width=100% align=left><tr><![endif]--><!--[if mso]><td style=width:600px valign=top width=600><![endif]--><table border=0 cellpadding=0 cellspacing=0 style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% class=mcnTextContentContainer align=left><tr><td style="padding:0 18px 9px;font-family:Tahoma,Verdana,Segoe,sans-serif;line-height:100%;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#414042;font-size:12px"valign=top class=mcnTextContent><p style="text-align:center;font-family:Tahoma,Verdana,Segoe,sans-serif;line-height:100%;margin:10px 0;padding:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#414042;font-size:12px"><span style=font-size:10px>NO PURCHASE NECESSARY TO ENTER, WIN OR CLAIM A PRIZE. A PURCHASE DOES NOT INCREASE YOUR CHANCES OF WINNING. Void where prohibited. Open only to permanent legal residents of the 50 United States or D.C. who are 18 years of age or older, and a SaverLife Member. Sweepstakes begins 7/16/18 at 9:00 AM PT and ends 10/7/18 at 8:59 AM PT. Prize restrictions apply. To enter and for the Official Rules and prize details, <a href=https://www.saverlife.org/scratchandsave/ style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#d99cc6;font-weight:400;text-decoration:underline target=_blank>click here</a>. Sponsor: EARN Inc., 235 Montgomery St., Suite 1050, San Francisco, CA 94104</span></table><!--[if mso]><![endif]--><!--[if mso]><![endif]--></table></table><!--[if (gte mso 9)|(IE)]><![endif]--></table></center>' // html body
                }

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
            }


            
        })

        // res.json({message: 'sending mails'});
        res.redirect('/dashboard');   
    },
    update: function(req, res){

        const contest = {
            title: req.body.title,
            max_winners: req.body.max_winners,
            winner_cards: [
                { 
                    title: req.body.winnercard1_title,
                    content: req.body.winnercard1_content,
                    img_url: req.body.winnercard1_image,
                    value: req.body.winnercard1_value
                },
                { 
                    title: req.body.winnercard2_title,
                    content: req.body.winnercard2_content,
                    img_url: req.body.winnercard2_image,
                    value: req.body.winnercard2_value
                },
                { 
                    title: req.body.winnercard3_title,
                    content: req.body.winnercard3_content,
                    img_url: req.body.winnercard3_image,
                    value: req.body.winnercard3_value
                },
            ],
            loser_card: {
                title: req.body.losercard_title,
                content: req.body.losercard_content,
                img_url: req.body.losercard_image,
            },
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
        };

        Contest.findByIdAndUpdate({_id: req.params.id}, {$set: contest}, { runValidators: true }, function(err){
            if(err){
                console.log('Something went wrong when updating a contest, detail: ', err);
                res.json({message: 'Error', error: err});
            }else{
                console.log('Update Successful!');
                // res.redirect(303, '/contests');
                res.json({message: 'Update Successful!'});
            }
        });
    },
    updateuploads: function(req, res){

        const contest = {
            title: req.body.title,
            max_winners: req.body.max_winners,
            winner_cards: [
                { 
                    title: req.body.winnercard1_title,
                    content: req.body.winnercard1_content,
                    img_url: req.body.winnercard1_image,
                    value: req.body.winnercard1_value
                },
                { 
                    title: req.body.winnercard2_title,
                    content: req.body.winnercard2_content,
                    img_url: req.body.winnercard2_image,
                    value: req.body.winnercard2_value
                },
                { 
                    title: req.body.winnercard3_title,
                    content: req.body.winnercard3_content,
                    img_url: req.body.winnercard3_image,
                    value: req.body.winnercard3_value
                },
            ],
            loser_card: {
                title: req.body.losercard_title,
                content: req.body.losercard_content,
                img_url: req.body.losercard_image,
            },
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
        };

        Contest.findByIdAndUpdate({_id: req.params.id}, {$set: contest}, { runValidators: true }, function(err){
            if(err){
                console.log('Something went wrong when updating a contest, detail: ', err);
                res.json({message: 'Error', error: err});
            }else{
                console.log('Update Successful!');
                // res.redirect(303, '/contests');
                res.json({message: 'Update Successful!'});
            }
        });
    },
    remove: function(req, res){
        Contest.findOneAndRemove({_id: req.params.id}, function(err){
            if(err){
                console.log('Something went wrong when removing a contest');
                res.json({message: 'Error', error: err});
            }else{
                Contest.find({}, function(err, contests){
                    if(err){
                        console.log('Something went wrong when getting all contests');
                        res.json({message: 'Error', error: err});
                    }else{
                        res.json({message: 'Success', data: contests});
                    }
                });
            }
        });
    },
}
