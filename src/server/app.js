#!/usr/bin/env node
'use strict'
const config = require('config')
const debug = require('debug')('peercalls')
const express = require('express')
const handleSocket = require('./socket.js')
const path = require('path')
const http = require('http')
const busboy = require('connect-busboy')
const cookieParser = require('cookie-parser')
// const { createServer } = require('./server.js')

const BASE_URL = config.get('baseUrl')
const SOCKET_URL = `${BASE_URL}/ws`

const app = express()
app.use(busboy())
app.use(cookieParser())
app.use(express.json({limit: '10mb'}))

const server = http.createServer(app)
const io = require('socket.io')(server, {path: SOCKET_URL})

app.locals.version = require('../../package.json').version
app.locals.baseUrl = BASE_URL


/**
 * Set up IO connections
 */
io.on('connection', socket => {
  handleSocket(socket, io)
})

const questFeed = io.of('/quest-feed')
questFeed.on('connection', socket => {
  console.log('Connected to quest feed')
})

app.sockets = [questFeed]
/**
 * Actually 'pug' is just popular template engine for node (previous Jade)
 */
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../views'))

const router = express.Router()
// router.use('/res', express.static(path.join(__dirname, '../res')))
router.use('/static', express.static(path.join(__dirname, '../../build')))

router.use('/call', require('./routes/call.js'))
router.use('/', require('./routes/index.js')(app))

/**
 * Map router object as routing for '/' path.
 */
app.use('/', router)

module.exports = server
