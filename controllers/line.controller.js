const { Line } = require("../models/index.model")

const getLines = async (req, res) => {
    try {
        const response = await Line.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getLines
}