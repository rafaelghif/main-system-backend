const { Router } = require('express')
const { getWorksheet } = require('../controllers/worksheet.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/CheckerId/:CheckerId', [verifyLogin, getWorksheet])

module.exports = router