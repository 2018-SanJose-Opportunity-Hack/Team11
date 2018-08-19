UserSchema = new mongoose.Schema({
    email: {type: String, required: [true, 'Email cannot be blank!']},
    participated_contests: [{ id: String, won: Boolean }],
    eligible: { type: Boolean, default: false },
    win: { type: Boolean, default: false }
}, {timestamps: true});
mongoose.model('User', UserSchema);
User = mongoose.model('User');