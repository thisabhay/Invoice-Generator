const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    invoiceNo: String,
    date: Date,
    orderNo: String,
    customerDetails: {
        name: String,
        address: String,
        gstNo: String,
        phoneNo: String,
        email: String
    },
    products: [{
        description: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    totalAmount: Number
});

module.exports = mongoose.model('Invoice', InvoiceSchema);