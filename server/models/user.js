UserSchema = new mongoose.Schema({
    email: {type: String, required: [true, 'Email']},
    participated_contests: [{ id: String, won: Boolean }]
}, {timestamps: true});
mongoose.model('User', UserSchema);
User = mongoose.model('User');