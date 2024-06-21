const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');

router.post('/generate', auth, async (req, res) => {
    try {
        const { invoiceNo, date, orderNo, customerDetails, products } = req.body;
        const totalAmount = products.reduce((sum, product) => sum + parseFloat(product.total), 0);
        const invoice = new Invoice({
            userId: req.user.id,
            invoiceNo,
            date,
            orderNo,
            customerDetails,
            products,
            totalAmount
        });
        await invoice.save();
        res.render('pages/invoice', { invoice });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Error generating invoice' });
    }
});

router.get('/list', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id });
        res.render('pages/invoice-list', { invoices });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Error fetching invoices' });
    }
});

module.exports = router;