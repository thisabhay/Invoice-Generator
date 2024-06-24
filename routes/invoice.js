const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { invoiceSchema } = require('../validators/invoiceValidators');

router.post('/generate', auth, async (req, res, next) => {
    try {
        const validatedData = invoiceSchema.parse(req.body);
        const invoice = new Invoice({
            userId: req.user.id,
            ...validatedData
        });

        await invoice.save();
        
        const user = await User.findById(req.user.id).select('-password');

        res.render('pages/invoice', { invoice, user });
    } catch (err) {
        next(err);
    }
});

router.get('/list', auth, async (req, res, next) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id }).sort({ date: -1 }).limit(10);
        res.render('pages/invoice-list', { invoices });
    } catch (err) {
        next(err);
    }
});

router.get('/view/:id', auth, async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) {
            return res.status(404).render('pages/error', { error: 'Invoice not found' });
        }

        const user = await User.findById(req.user.id).select('-password');

        res.render('pages/invoice', { invoice, user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;