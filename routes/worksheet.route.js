const multer = require('multer')
const { Router } = require('express')
const { getWorksheet, addWorksheet, addWorksheetDetail, getWorksheetDetail, getWorksheetDetailTemp, saveWorksheet, getWorksheetTimeline, approveWorksheet, getInspectionWorksheet } = require('../controllers/worksheet.controller')
const { verifyLogin } = require('../middlewares/auth.middleware')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/worksheets')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileNameArr = file.originalname.split(".")
        const ext = fileNameArr[fileNameArr.length - 1]
        cb(null, `worksheet-${uniqueSuffix}.${ext}`)
    }
})

const upload = multer({ storage: storage })

router.get('/CheckerId/:CheckerId', [verifyLogin, getWorksheet])
router.get('/inspectionWorksheet/CheckerId/:CheckerId', [verifyLogin, getInspectionWorksheet])
router.get('/WorksheetTimeline/CheckerId/:CheckerId', [verifyLogin, getWorksheetTimeline])
router.get('/WorksheetDetail/CheckerId/:CheckerId', [verifyLogin, getWorksheetDetail])
router.get('/WorksheetDetailTemp/CheckerId/:CheckerId', [verifyLogin, getWorksheetDetailTemp])
router.post('/', [verifyLogin, addWorksheet])
router.post('/addWorksheetDetail', [verifyLogin, upload.single('inspectionPicture'), addWorksheetDetail])
router.post('/saveWorksheet', [verifyLogin, saveWorksheet])
router.post('/ApproveWorksheet', [verifyLogin, approveWorksheet])

module.exports = router