const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { name, gstNo, phoneNo, email, addressLine1, addressLine2, state, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).render('pages/error', { error: 'User already exists' });
        }
        user = new User({
            name, gstNo, phoneNo, email, addressLine1, addressLine2, state, password
        });
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Server error during login' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;