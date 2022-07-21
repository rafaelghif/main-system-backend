const { Worksheet, WorksheetDetail, WorksheetDetailTemp, WorksheetTimeline, Checker, CheckerPart } = require("../models/index.model")
const { Op } = require('sequelize')

const getWorksheet = async (req, res) => {
    try {
        const response = await Worksheet.findAll({
            where: {
                CheckerId: req.params.CheckerId,
                status: {
                    [Op.not]: 'Created'
                }
            },
            include: [{
                model: WorksheetDetail
            }],
            order: [
                ['revision', 'DESC'],
                [WorksheetDetail, 'sequence', 'ASC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getInspectionWorksheet = async (req, res) => {
    try {
        const response = await Worksheet.findOne({
            where: {
                CheckerId: req.params.CheckerId
            },
            include: [
                {
                    model: WorksheetDetail,
                    include: [{
                        model: CheckerPart
                    }]
                },
            ],
            order: [
                ['createdAt', 'DESC'],
                [WorksheetDetail, 'sequence', 'ASC']
            ],
        });
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getWorksheetTimeline = async (req, res) => {
    try {
        const response = await WorksheetTimeline.findAll({
            where: {
                CheckerId: req.params.CheckerId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const addWorksheet = async (req, res) => {
    try {
        req.body.createdBy = req.decoded.badgeId
        req.body.updatedBy = req.decoded.badgeId

        const response = await Worksheet.create(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const addWorksheetDetail = async (req, res) => {
    try {
        const response = await WorksheetDetailTemp.create({
            inspectionItem: req.body.inspectionItem,
            inspectionPicture: req.file.filename,
            sequence: req.body.sequence,
            specialChange: req.body.specialChange === '' ? null : req.body.specialChange,
            createdBy: req.decoded.badgeId,
            updatedBy: req.decoded.badgeId,
            WorksheetId: req.body.WorksheetId,
            CheckerPartId: req.body.CheckerPartId === '' ? null : req.body.CheckerPartId
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getWorksheetDetail = async (req, res) => {
    try {
        const response = await Worksheet.findOne({
            where: {
                status: 'Approved',
                CheckerId: req.params.CheckerId
            },
            order: [
                ['createdAt', 'DESC'],
                [WorksheetDetail, 'sequence', 'ASC']
            ],
            include: [{
                model: WorksheetDetail
            }],
            limit: 1
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getWorksheetDetailTemp = async (req, res) => {
    try {
        const response = await Worksheet.findOne({
            where: {
                CheckerId: req.params.CheckerId
            },
            include: [{
                model: WorksheetDetailTemp,
            }],
            order: [
                ['createdAt', 'DESC'],
                [WorksheetDetailTemp, 'sequence', 'ASC']
            ],
            limit: 1
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const saveWorksheet = async (req, res) => {
    try {
        const responseUpdateWorksheet = await Worksheet.update({
            status: 'Issued'
        }, {
            where: {
                id: req.body.WorksheetId
            }
        });

        if (responseUpdateWorksheet[0] !== 1) return res.status(403).send({ msg: 'Failed Update Worksheet' })

        const responseGetWorksheetDetailTemp = await WorksheetDetailTemp.findAll({
            where: {
                WorksheetId: req.body.WorksheetId
            }
        })

        const responseInsWorksheetDetail = await WorksheetDetail.bulkCreate(JSON.parse(JSON.stringify(responseGetWorksheetDetailTemp)))
        if (responseInsWorksheetDetail.length < 1) return res.status(403).send({ msg: 'Failed Insert Worksheet Detail' })

        const responseDeleteWorksheetTemp = await Worksheet.destroy({
            where: {
                CheckerId: req.body.CheckerId,
                status: 'Created'
            }
        })

        const responseDeleteWorksheetDetailTemp = await WorksheetDetailTemp.destroy({
            where: {
                WorksheetId: req.body.WorksheetId
            }
        })

        const responseWorksheet = await Worksheet.findByPk(req.body.WorksheetId)

        const responseWorksheetTimeline = await WorksheetTimeline.create({
            timeLineContent: `${req.decoded.badgeId} - Add Worksheet (${responseWorksheet.content}) Revision (${responseWorksheet.revision})`,
            createdBy: req.decoded.badgeId,
            updatedBy: req.decoded.badgeId,
            CheckerId: req.body.CheckerId
        })

        return res.status(200).json({ msg: 'Success Save Worksheet' })
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const approveWorksheet = async (req, res) => {
    try {
        const response = await Worksheet.update({
            status: 'Approved',
            approvedBy: req.decoded.badgeId,
            approveAt: new Date()
        }, {
            where: {
                id: req.body.id
            }
        })

        const responseWorksheet = await Worksheet.findByPk(req.body.id);

        const responseWorksheetTimeline = await WorksheetTimeline.create({
            timeLineContent: `${req.decoded.badgeId} - Approve Worksheet (${responseWorksheet.content}) Revision (${responseWorksheet.revision})`,
            createdBy: req.decoded.badgeId,
            updatedBy: req.decoded.badgeId,
            CheckerId: req.body.CheckerId
        })

        return res.status(200).json({ msg: 'Success Approve Worksheet' })
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getWorksheet,
    getInspectionWorksheet,
    getWorksheetTimeline,
    getWorksheetDetail,
    getWorksheetDetailTemp,
    addWorksheet,
    addWorksheetDetail,
    saveWorksheet,
    approveWorksheet
}