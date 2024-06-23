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
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);

