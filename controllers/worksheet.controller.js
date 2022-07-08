const { Worksheet, WorksheetDetail } = require("../models/index.model")

const getWorksheet = async (req, res) => {
    try {
        const response = await Worksheet.findAll({
            where: {
                CheckerId: req.params.CheckerId
            },
            include: [{
                model: WorksheetDetail
            }],
            order: [
                [WorksheetDetail, 'sequence', 'ASC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getWorksheet
}