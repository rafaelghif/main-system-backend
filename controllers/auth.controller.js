const { User, Role, Department } = require("../models/index.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authentication = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                badgeId: req.body.badgeId
            },
            include: [{
                model: Role,
                required: true
            }, {
                model: Department,
                required: true
            }]
        })

        if (response === null) return res.status(403).send({ msg: 'BadgeId Not Found!' })
        if (!bcrypt.compareSync(req.body.password, response.password)) return res.status(403).send({ msg: 'Wrong Password!' })

        const token = jwt.sign({ badgeId: response.badgeId }, process.env.JWT_SECRET_KEY, { expiresIn: 8600 })

        return res.status(200).json({ token: token, response })
    } catch (err) {
        return res.status(500).json({ msg: err.toString() })
    }
}

module.exports = {
    authentication
}