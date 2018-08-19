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
    one: function(req, res){
        Contest.findOne({_id: req.params.id}, function(err, contest){
            if(err){
                console.log('Something went wrong when getting a single contest');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: contest});
            }
        });
    },
    create: function(req, res){
        // User.find({}, function(err, users) {
        //     if(err){
        //         console.log('Something went wrong when getting all users');
        //         res.json({message: 'Error', error: err});
        //     }else{ 
        //         function spin(arr) {
        //             var rand = Math.floor(Math.random() * arr.length);
        //             var num = numbers[rand];
        //             numbers.splice(rand,1);
        //             return num;
        //         }
        //         const index_arr  = [];
        //         for (let i = 0; i < users.length; i++) {
        //             index_arr.push(i);
        //         }

        //         const amount = Math.min(req.body.max_winners, users.length);
        //         const users_won_arr = [];
        //         for (let j = 0; i < amount; i++) {
        //             users_won_arr.push(users[spin(index_arr)]);
        //         }

                const today = new Date(); const after_week = new Date();
                after_week.setDate(today.getDate() + 7);
                const contest = { 
                    max_winners: req.body.max_winners,
                    loser_card: req.body.loser_card,
                    winner_cards: req.body.winner_cards,
                    start_date: today,
                    end_date: after_week,
                    users_won: req.body.users_won
                };
                Contest.create(contest, function(err){
                    if(err){
                        console.log('Something went wrong when creating a contest, detail: ', err);
                        res.json({message: 'Error', error: err});   
                    }else{
                        res.redirect('/contests');
                    }
                });
        //     }
        // });
    },
    update: function(req, res){
        Contest.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, { runValidators: true }, function(err){
            if(err){
                console.log('Something went wrong when updating a contest, detail: ', err);
                res.json({message: 'Error', error: err});
            }else{
                res.redirect(303, '/contests');
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