require('../models/user.js');

const ContestSchema = new mongoose.Schema({
    message: {type: String, required: [true, 'Message cannot be blank!']},
    max_winners: Number,
    winner_cards: [{ img_url: String, value: Number }],
    time_period: { start_date: Date, end_date: Date },
    users_won: [UserSchema]
}, {timestamps: true});
mongoose.model('Contest', ContestSchema);
Contest = mongoose.model('Contest');