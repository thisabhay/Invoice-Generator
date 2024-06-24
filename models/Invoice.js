const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const invoiceSchema = {
    userId: ObjectId,
    invoiceNo: String,
    date: Date,
    orderNo: String,
    customerDetails: {
        name: String,
        address: String,
        phone: String,
        email: String
    },
    products: [
        {
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    subtotal: Number,
    taxRate: Number,
    taxAmount: Number,
    totalAmount: Number
};

const createInvoice = async (invoiceData) => {
    const db = getDB();
    const result = await db.collection('invoices').insertOne(invoiceData);
    return result.insertedId;
};

const findInvoicesByUserId = async (userId) => {
    const db = getDB();
    return await db.collection('invoices').find({ userId: new ObjectId(userId) }).sort({ date: -1 }).toArray();
};

module.exports = {
    createInvoice,
    findInvoicesByUserId
};
