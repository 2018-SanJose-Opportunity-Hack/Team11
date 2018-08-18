UserSchema = new mongoose.Schema({
    email: {type: String, required: [true, 'Email cannot be blank!']},
    password: {type: String, required: [true, 'Password cannot be blank!'], minlength: [8, 'Password must be at least 8 characters.']},
    participated_contests: [{ id: String, won: Boolean }]
}, {timestamps: true});
mongoose.model('User', UserSchema);
User = mongoose.model('User');