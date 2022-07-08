const { Router } = require('express')
const { generateQrPdf } = require('../controllers/qr.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/', [verifyLogin, generateQrPdf])

module.exports = router