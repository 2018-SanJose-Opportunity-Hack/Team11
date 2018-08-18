require('../models/user.js');

const ContestSchema = new mongoose.Schema({
    max_winners: { type: Number, default: 1 },
    loser_card: { img_url: String, title: String, content: String },
    winner_cards: [{ img_url: String, value: Number, title: String, content: String }],
    start_date: Date, 
    end_date: Date,
    users_won: [UserSchema]
}, {timestamps: true});
mongoose.model('Contest', ContestSchema);
Contest = mongoose.model('Contest');