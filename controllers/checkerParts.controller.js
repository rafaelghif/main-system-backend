const { CheckerPart, Checker, CheckerPartHistory } = require("../models/index.model")

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

const getCheckerPartsHistory = async (req, res) => {
    try {
        const response = await CheckerPartHistory.findAll({
            where: {
                CheckerPartId: req.params.CheckerPartId
            },
            order: [
                ['updatedAt', 'DESC']
            ]
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

const changeCheckerPart = async (req, res) => {
    try {
        const responseCheckerParts = await CheckerPart.findByPk(req.body.CheckerPartId)
        await CheckerPartHistory.create({
            name: responseCheckerParts.name,
            serialNumber: responseCheckerParts.serialNumber,
            changeDate: responseCheckerParts.changeDate,
            createdBy: responseCheckerParts.createdBy,
            updatedBy: responseCheckerParts.updatedBy,
            createdAt: responseCheckerParts.createdAt,
            updatedAt: responseCheckerParts.updatedAt,
            CheckerPartId: req.body.CheckerPartId,
        })

        await CheckerPart.update({
            serialNumber: req.body.serialNumber,
            changeDate: new Date(),
            updatedBy: req.decoded.badgeId,
        }, {
            where: {
                id: req.body.CheckerPartId
            }
        })
        return res.status(200).json({ msg: 'Success Change Checker Part' })
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getDataCheckerParts,
    getCheckerPartsHistory,
    addCheckerPart,
    changeCheckerPart
}