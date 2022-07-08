require('dotenv').config()

const express = require('express')
const helmet = require("helmet")
const cors = require("cors")

const morgan = require("morgan")
var path = require('path')
var rfs = require('rotating-file-stream')

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
})

const app = express()

app.use(cors())
app.use(helmet({
    crossOriginResourcePolicy: false,
}))
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.static('public'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

const routes = require('./routes/index.route')(app)
const model = require('./models/index.model')

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})