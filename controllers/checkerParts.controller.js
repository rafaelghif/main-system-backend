const { CheckerPart, Checker } = require("../models/index.model")

const getDataCheckerParts = async (req, res) => {
    try {
        const response = await CheckerPart.findAll({
            include: [{
                model: Checker,
                where: {
                    id: req.params.CheckerId
                }
            }]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const addCheckerPart = async (req, res) => {
    try {
        const response = await CheckerPart.create(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getDataCheckerParts,
    addCheckerPart
}