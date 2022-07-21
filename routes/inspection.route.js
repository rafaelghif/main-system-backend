const { Router } = require('express')
const { getInspection, addInspection, getDetailInspection, getInspectionTimeline, getInspectionDetailCheck, getInspectionVerify, verifyInspection, getInspectionOne } = require('../controllers/inspection.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

router.get('/', [verifyLogin, getInspection])
router.get('/inspectionOne/InspectionId/:InspectionId', [verifyLogin, getInspectionOne])
router.get('/inspectionDetail/InspectionId/:InspectionId', [verifyLogin, getDetailInspection])
router.get('/inspectionDetailCheck/InspectionDetailId/:InspectionDetailId', [verifyLogin, getInspectionDetailCheck])
router.get('/inspectionDetailTimeline/:InspectionId', [verifyLogin, getInspectionTimeline])
router.get('/inspectionVerify', [verifyLogin, getInspectionVerify])

router.post('/', [verifyLogin, addInspection])
router.post('/verifyInspection', [verifyLogin, verifyInspection])

module.exports = router