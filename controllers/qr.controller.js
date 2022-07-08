var pdf = require('pdf-creator-node')
var fs = require("fs");
const { Checker, Line } = require('../models/index.model');

const generateQrPdf = async (req, res) => {
    try {
        const responseChecker = await Checker.findAll({
            order: [
                ['regNo', 'ASC']
            ],
            include: {
                model: Line
            }
        })

        var html = fs.readFileSync("public/template/qrcode.html", "utf8");

        var options = {
            format: "A4",
            orientation: "portrait",
        };

        var datas = responseChecker.map((data) => {

            const bitmap = fs.readFileSync(`public/images/checker-qr/${data.qrCode}`);
            const qrCode = bitmap.toString('base64')
            
            return {
                regNo: data.regNo,
                checkerName: data.checkerName,
                qrCode: qrCode,
                line: data.Line.name
            }
        })

        var document = {
            html: html,
            data: {
                datas: datas,
            },
            path: "./public/documents/qr.pdf",
            type: "",
        };

        await pdf
            .create(document, options)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log('Error Generate ', error)
            });

        return res.download('public/documents/qr.pdf')
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    generateQrPdf
}