#!/usr/bin/env node
'use strict'
var fs = require('fs')
const recognize = require('../speech/GSpeechRecognition')

const router = require('express').Router()

// router.get('/', (req, res) => {
//   res.render('index')
// })

router.post('/speech', (req, res) => {
  recognize(req.body.data, (data) => {
    router.application.sockets[0].emit('transcribe', {
      'text': data,
      'user': req.cookies['io']
    })
  })
  res.send(200)
})

router.get('/questfeed', (req, res) => {
  res.render('feed')
})

module.exports = (app) => {
  router.application = app
  return router
}
