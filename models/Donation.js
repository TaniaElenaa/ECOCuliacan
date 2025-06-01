const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    cardHolder: {
        type: String,
        required: true
    },
    // amount: { // Si tu formulario de donación tiene un campo para el monto
    //     type: Number,
    //     required: true
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asume que tienes un modelo de User
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);
