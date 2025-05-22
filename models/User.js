const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: { // Campo para el género
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'], // Opciones válidas para el género
        default: 'prefer_not_to_say' // Valor por defecto si no se especifica
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', UserSchema);