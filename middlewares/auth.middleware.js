const jwt = require('jsonwebtoken')

const verifyLogin = (req, res, next) => {
    try {
        var token = req.headers.authorization.split("Bearer ")[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
                if (err) {
                    return res.status(403).send('Token Invalid')
                } else {
                    req.decoded = result
                    next()
                }
            })
        } else {
            throw new Error('Token Not Provided')
        }
    } catch (err) {
        return res.status(403).send('Token Not Provided!')
    }
}

module.exports = {
    verifyLogin
}