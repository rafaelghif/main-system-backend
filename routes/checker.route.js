const { Router } = require('express')
const { getCheckers, addChecker } = require('../controllers/checker.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/', [verifyLogin, getCheckers])
router.post('/', [verifyLogin, addChecker])

module.exports = router