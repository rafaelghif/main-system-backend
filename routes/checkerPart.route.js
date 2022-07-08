const { Router } = require('express')
const { getDataCheckerParts, addCheckerPart } = require('../controllers/checkerParts.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/CheckerId/:CheckerId', [verifyLogin, getDataCheckerParts])
router.post('/', [verifyLogin, addCheckerPart])

module.exports = router