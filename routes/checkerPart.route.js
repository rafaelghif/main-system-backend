const { Router } = require('express')
const { getDataCheckerParts, addCheckerPart, getCheckerPartsHistory, changeCheckerPart } = require('../controllers/checkerParts.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/CheckerId/:CheckerId', [verifyLogin, getDataCheckerParts])
router.get('/CheckerPartsHistory/CheckerPartId/:CheckerPartId', [verifyLogin, getCheckerPartsHistory])

router.post('/', [verifyLogin, addCheckerPart])
router.post('/changeCheckerPart', [verifyLogin, changeCheckerPart])

module.exports = router