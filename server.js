require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');
const auth = require('./middleware/auth');
const { findUserById } = require('./models/User');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

app.get('/', (req, res) => res.render('pages/index'));
app.get('/register', (req, res) => res.render('pages/register'));
app.get('/login', (req, res) => res.render('pages/login'));
app.get('/generate-invoice', auth, (req, res) => res.render('pages/generate-invoice'));

app.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).render('pages/error', { error: 'User not found' });
        }
        delete user.password;
        res.render('pages/dashboard', { user });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Server error' });
    }
});

connectDB().then(() => {
    console.log('Connected to the database');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});

module.exports = app;
