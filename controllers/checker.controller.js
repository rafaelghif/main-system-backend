const { Checker, Inspection, Line, CheckerPart, InspectionDetail, Worksheet, WorksheetDetail } = require("../models/index.model")
const fs = require('fs')
const QRCode = require('qrcode')
const md5 = require('md5')
const moment = require('moment')

const getCheckers = async (req, res) => {
    try {
        const response = await Checker.findAll({
            order: [
                ['regNo', 'ASC']
            ]
        });
        return res.status(200).send(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const getCheckerInformation = async (req, res) => {
    try {
        const response = await Checker.findByPk(req.params.CheckerId, {
            include: [{
                model: Line
            }, {
                model: CheckerPart,
                required: false
            }, {
                model: Inspection,
                include: [{
                    model: InspectionDetail,
                    required: false
                }],
            }, {
                model: Worksheet,
                where: {
                    status: 'Approved'
                },
                include: [{
                    model: WorksheetDetail,
                    required: false
                }],
                required: false
            }],
        })
        return res.status(200).send(response)
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

const addChecker = async (req, res) => {
    try {
        const response = await Checker.create(req.body)

        const fileName = `${md5(moment().format('YYYY-MM-DD HH:mm:ss'))}.png`

        QRCode.toDataURL(response.id, {}, (err, url) => {
            if (err) throw err
            var string = url;
            var regex = /^data:.+\/(.+);base64,(.*)$/;

            var matches = string.match(regex);
            var data = matches[2];
            var buffer = Buffer.from(data, 'base64');
            fs.writeFileSync(`public/images/checker-qr/${fileName}`, buffer);
        })

        const responseInspection = await Inspection.create({
            CheckerId: response.id
        })

        const responseUpd = await Checker.update({
            qrCode: fileName
        }, {
            where: {
                id: response.id
            }
        })

        const responseChecker = await Checker.findAll({
            order: [
                ['regNo', 'ASC']
            ]
        })

        return res.status(200).send({ msg: `Success Add Checker ${response.id}` })
    } catch (err) {
        return res.status(403).send({ msg: err.toString() })
    }
}

module.exports = {
    getCheckers,
    getCheckerInformation,
    addChecker
}