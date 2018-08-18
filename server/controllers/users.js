require('../models/user.js');

module.exports = {
    all: function(req, res){
        User.find({}).sort('createdAt').exec(function(err, users){
            if(err){
                console.log('Something went wrong when getting all users');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: users});
            }
        });
    },
    one: function(req, res){
        User.findOne({_id: req.params.id}, function(err, user){
            if(err){
                console.log('Something went wrong when getting a single user');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: user});
            }
        });
    },
    create: function(req, res){
        User.create(req.body, function(err){
            if(err){
                console.log('Something went wrong when creating a user, detail: ', err);
                res.json({message: 'Error', error: err});   
            }else{
                res.redirect('/users');
            }
        });
    },
    update: function(req, res){
        User.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, { runValidators: true }, function(err){
            if(err){
                console.log('Something went wrong when updating a user, detail: ', err);
                res.json({message: 'Error', error: err});
            }else{
                res.redirect(303, '/users');
            }
        });
    },
    remove: function(req, res){
        User.findOneAndRemove({_id: req.params.id}, function(err){
            if(err){
                console.log('Something went wrong when removing a user');
                res.json({message: 'Error', error: err});
            }else{
                user.find({}, function(err, users){
                    if(err){
                        console.log('Something went wrong when getting all users');
                        res.json({message: 'Error', error: err});
                    }else{
                        res.json({message: 'Success', data: users});
                    }
                });
            }
        });
    },
}