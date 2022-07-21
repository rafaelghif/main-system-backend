const { Router } = require('express')
const { getCheckers, addChecker, getCheckerInformation } = require('../controllers/checker.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/', [verifyLogin, getCheckers])
router.get('/checkerInformation/CheckerId/:CheckerId', [verifyLogin, getCheckerInformation])
router.post('/', [verifyLogin, addChecker])

module.exports = router