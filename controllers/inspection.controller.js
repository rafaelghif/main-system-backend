const fs = require('fs')
const { Op } = require("sequelize")
const { connDatabase } = require("../config/database.config")
const { Checker, Inspection, Line, InspectionDetail, WorksheetDetail, CheckerPart, InspectionDetailCheck, InspectionTimeline, CheckerPartHistory } = require("../models/index.model")

const getInspection = async (req, res) => {
    try {
        const response = await Inspection.findAll({
            include: [{
                model: Checker,
                include: [{
                    model: Line
                }]
            }, {
                model: InspectionDetail,
                where: {
                    status: {
                        [Op.not]: 'Rejected'
                    }
                },
                limit: 1,
                order: [
                    ['createdAt', 'DESC']
                ],
            }],
        })

        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getInspectionOne = async (req, res) => {
    try {
        const response = await Inspection.findOne({
            include: [{
                model: Checker,
                include: [{
                    model: Line
                }]
            }, {
                model: InspectionDetail,
                where: {
                    status: {
                        [Op.not]: 'Rejected'
                    }
                },
                limit: 1,
                order: [
                    ['createdAt', 'DESC']
                ],
            }],
            where: {
                id: req.params.InspectionId
            }
        })

        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getDetailInspection = async (req, res) => {
    try {
        const response = await Inspection.findOne({
            include: [{
                model: InspectionDetail
            }],
            where: {
                id: req.params.InspectionId
            },
            order: [
                [InspectionDetail, 'createdAt', 'DESC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getInspectionTimeline = async (req, res) => {
    try {
        let response;
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getInspectionDetailCheck = async (req, res) => {
    try {
        const response = await InspectionDetailCheck.findAll({
            where: {
                InspectionDetailId: req.params.InspectionDetailId
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

const addInspection = async (req, res) => {
    const transaction = await connDatabase.transaction();
    try {
        const responseAddInspectionDetail = await InspectionDetail.create({
            createdBy: req.decoded.badgeId,
            updatedBy: req.decoded.badgeId,
            InspectionId: req.body.InspectionId,
            WorksheetId: req.body.WorksheetId
        })

        req.body.inspection.map(async (data) => {
            if (data.inspectionStatus === 'Change') {
                const responseWorksheetDetail = await WorksheetDetail.findOne({
                    where: {
                        id: data.WorksheetDetailId,
                        CheckerPartId: {
                            [Op.not]: null
                        }
                    },
                    include: [{
                        model: CheckerPart
                    }]
                });

                if (responseWorksheetDetail !== null) {

                    const responseCheckerParts = await CheckerPart.findByPk(responseWorksheetDetail.CheckerPartId)

                    await CheckerPartHistory.create({
                        name: responseCheckerParts.name,
                        serialNumber: responseCheckerParts.serialNumber,
                        changeDate: responseCheckerParts.changeDate,
                        createdBy: responseCheckerParts.createdBy,
                        updatedBy: responseCheckerParts.updatedBy,
                        createdAt: responseCheckerParts.createdAt,
                        updatedAt: responseCheckerParts.updatedAt,
                        CheckerPartId: responseWorksheetDetail.CheckerPartId,
                    })

                    await CheckerPart.update({
                        changeDate: Date.now(),
                        serialNumber: data.serialNumber,
                        updatedBy: req.decoded.badgeId
                    }, {
                        where: {
                            id: responseWorksheetDetail.CheckerPartId
                        }
                    })
                }
            }

            var fileName = []

            data.photo.map((resPhoto) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const tempFileName = `inspection-${uniqueSuffix}.${data.photoType}`
                fileName.push(tempFileName);
                fs.writeFile(`public/images/inspections/${tempFileName}`, resPhoto, { encoding: 'base64' }, function (err) {
                    if (err) {
                        console.log('err', err)
                    } else {
                        console.log('File created');
                    }
                });
            })

            await InspectionDetailCheck.create({
                picture: fileName.join(','),
                InspectionDetailId: responseAddInspectionDetail.id,
                WorksheetId: req.body.WorksheetId,
                WorksheetDetailId: data.WorksheetDetailId,
            })
        })

        await InspectionTimeline.create({
            content: `${req.decoded.badgeId} - Make new inspection`,
            createdBy: req.decoded.badgeId,
            updatedBy: req.decoded.badgeId,
            InspectionDetailId: responseAddInspectionDetail.id
        })

        await transaction.commit();
        return res.status(200).json({ msg: 'Success Add Inspection' })
    } catch (err) {
        await transaction.rollback();
        return res.status(403).send({ msg: err.toString() })
    }
}

const getInspectionVerify = async (req, res) => {
    try {
        const response = await Inspection.findAll({
            include: [{
                model: InspectionDetail,
                where: {
                    status: 'Issued'
                }
            }, {
                model: Checker,
                include: [{
                    model: Line
                }]
            }],
            order: [
                [InspectionDetail, 'createdAt', 'ASC']
            ]
        })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const verifyInspection = async (req, res) => {
    const transaction = await connDatabase.transaction();
    try {
        var inspectionStatus = 'Verified'

        await Promise.all(req.body.datas.map(async (data) => {
            await InspectionDetailCheck.update({
                status: data.InspectionCheckStatus,
                updatedBy: req.decoded.badgeId
            }, {
                where: {
                    id: data.InspectionDetailCheckId
                }
            });
            if (data.InspectionCheckStatus === 'Reject') {
                inspectionStatus = 'Rejected'
            }
        }))

        await InspectionDetail.update({
            status: inspectionStatus,
            verifiedBy: req.decoded.badgeId,
            verifiedAt: new Date(),
        }, {
            where: {
                id: req.body.datas[0].InspectionDetailId
            }
        });

        return res.status(200).json({ msg: 'Success Verify Inspection' })
    } catch (err) {
        await transaction.rollback();
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getInspection,
    getInspectionOne,
    getDetailInspection,
    getInspectionVerify,
    getInspectionDetailCheck,
    getInspectionTimeline,
    addInspection,
    verifyInspection
}