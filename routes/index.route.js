module.exports = (app) => {
    app.use('/api/auth', require('./auth.route'))
    app.use('/api/qr', require('./qr.route'))
    app.use('/api/checker', require('./checker.route'))
    app.use('/api/line', require('./line.route'))
    app.use('/api/checkerParts', require('./checkerPart.route'))
    app.use('/api/worksheet', require('./worksheet.route'))
}