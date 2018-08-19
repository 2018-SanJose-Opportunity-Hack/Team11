require('../models/contest.js');

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
                res.redirect('/contests');
            }
        });
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
