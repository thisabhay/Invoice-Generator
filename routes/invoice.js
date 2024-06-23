const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
router.post('/generate', auth, async (req, res) => {
    try {
        const { invoiceNo, date, orderNo, customerDetails, products, taxRate } = req.body;
        
        const subtotal = products.reduce((sum, product) => sum + (parseFloat(product.quantity) * parseFloat(product.price)), 0);
        const taxRateValue = parseFloat(taxRate) || 0;
        const taxAmount = subtotal * (taxRateValue / 100);
        const totalAmount = subtotal + taxAmount;


        const invoice = new Invoice({
            userId: req.user.id,
            invoiceNo,
            date,
            orderNo,
            customerDetails,
            products,
            subtotal,
            taxRate: taxRateValue,
            taxAmount,
            totalAmount
        });

        await invoice.save();
        
        const user = await User.findById(req.user.id).select('-password');

        res.render('pages/invoice', { invoice, user });
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

router.get('/view/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).render('pages/error', { error: 'Invoice not found' });
        }
        if (invoice.userId.toString() !== req.user.id) {
            return res.status(403).render('pages/error', { error: 'Not authorized to view this invoice' });
        }

        // Fetch user details
        const user = await User.findById(req.user.id).select('-password');

        res.render('pages/invoice', { invoice, user }); // Pass both invoice and user to the template
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Error fetching invoice' });
    }
});

module.exports = router;
