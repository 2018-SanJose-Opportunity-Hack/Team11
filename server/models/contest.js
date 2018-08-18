require('../models/user.js');

const ContestSchema = new mongoose.Schema({
    message: {type: String, required: [true, 'Message cannot be blank!']},
    winner_cards: [{ img_url: String, value: Number }],
    users_won: [UserSchema]
}, {timestamps: true});
mongoose.model('Contest', ContestSchema);
Contest = mongoose.model('Contest');