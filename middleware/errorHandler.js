const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', { error: 'Something went wrong!' });
};

module.exports = errorHandler;