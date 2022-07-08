const { Router } = require('express')
const { getLines } = require('../controllers/line.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/', [verifyLogin, getLines])

module.exports = router