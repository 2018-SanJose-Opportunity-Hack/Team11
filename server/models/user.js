require('../models/contest.js');

UserSchema = new mongoose.Schema({
    email: {type: String, required: [true, 'Email cannot be blank!']},
    participated: { type: Boolean, default: false },
    win: { type: Boolean, default: false },
    day: String,
    hour: Number,
    password: {type: String, required: [true, 'Password cannot be blank!'], minlength: [8, 'Password must be at least 8 characters.']},
    participated_contests: [{id: String}]
}, {timestamps: true});
mongoose.model('User', UserSchema);
User = mongoose.model('User');
