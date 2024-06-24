const express = require('express');
const jwt = require('jsonwebtoken');
const { registrationSchema, loginSchema } = require('../validators/authValidators');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const validatedData = registrationSchema.parse(req.body);
        let user = await User.findOne({ email: validatedData.email });
        if (user) {
            return res.status(400).render('pages/error', { error: 'User already exists' });
        }

        user = new User(validatedData);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;