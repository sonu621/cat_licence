const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    documents: {
        iqama: String,
        drivingLicense: String,
        certificates: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);