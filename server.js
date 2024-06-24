require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

app.get('/', (req, res) => res.render('pages/index'));
app.get('/register', (req, res) => res.render('pages/register'));
app.get('/login', (req, res) => res.render('pages/login'));
app.get('/generate-invoice', auth, (req, res) => res.render('pages/generate-invoice'));

app.get('/dashboard', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).render('pages/error', { error: 'User not found' });
        }
        res.render('pages/dashboard', { user });
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use(errorHandler);

// Connect to the database
connectDB().then(() => {
    console.log('Connected to the database');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});

module.exports = app;