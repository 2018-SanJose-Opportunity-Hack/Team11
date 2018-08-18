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
        Contest.create(req.body, function(err){
            if(err){
                console.log('Something went wrong when creating a contest, detail: ', err);
                res.json({message: 'Error', error: err});   
            }else{
                res.redirect('/contests');
            }
        });
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