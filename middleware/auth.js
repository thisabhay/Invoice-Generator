const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.cookies.token || req.header('x-auth-token');
    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).clearCookie('token').redirect('/login');
    }
};
