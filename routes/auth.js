const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, userSchema } = require('../models/User');
const { z } = require('zod');

const router = express.Router();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

router.post('/register', async (req, res) => {
    try {
        const validation = userSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).render('pages/error', { error: validation.error.errors[0].message });
        }

        let user = await findUserByEmail(req.body.email);
        if (user) {
            return res.status(400).render('pages/error', { error: 'User already exists' });
        }

        const userId = await createUser(req.body);

        const payload = { user: { id: userId.toString() } };

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
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).render('pages/error', { error: validation.error.errors[0].message });
        }

        const { email, password } = req.body;
        let user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('pages/error', { error: 'Invalid Credentials' });
        }

        const payload = { user: { id: user._id.toString() } };

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