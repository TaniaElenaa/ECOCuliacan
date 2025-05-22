const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: String, // O Number, dependiendo del formato
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    problemDescription: { // Campo para la descripción del problema
        type: String,
        required: true
    },
    reportDate: {
        type: Date,
        default: Date.now
    },
    // Puedes añadir un campo para el usuario que hizo el reporte
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});
module.exports = mongoose.model('Report', ReportSchema);