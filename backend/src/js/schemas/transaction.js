const mongoose = require('mongoose');
//const { Schema } = mongoose;

const transactionSchema = mongoose.Schema({
    yearlyIndex: {type: Number, required: true},
    date: {type: Date, required: true},
    institution: {type: String, required: false},
    text: {type: String, required: true},
    comment: {type: String, required: false},
    type: {type: Number, required: true},
    amount: {type: Number, required: true}
});

exports.Transaction = mongoose.model('Transaction', transactionSchema)