require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');
const auth = require('./middleware/auth');
const User = require('./models/User');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

app.get('/', (req, res) => res.render('pages/index'));
app.get('/register', (req, res) => res.render('pages/register'));
app.get('/login', (req, res) => res.render('pages/login'));
app.get('/generate-invoice', auth, (req, res) => res.render('pages/generate-invoice'));

app.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).render('pages/error', { error: 'User not found' });
        }
        res.render('pages/dashboard', { user });
    } catch (err) {
        console.error(err.message);
        res.status(500).render('pages/error', { error: 'Server error' });
    }
});

// Connect to the database and start the server
connectDB().then(() => {
    console.log('Connected to the database');
}).catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});

// Export the Express app for Vercel
module.exports = app;
