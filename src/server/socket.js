'use strict'
const debug = require('debug')('peer-calls:socket')
const _ = require('underscore')

/**
 * Two parameters
 *
 *  signal and ready
 */

module.exports = function (socket, io) {
  socket.on('signal', payload => {
    console.log('signal: %s, payload: %o', socket.id, payload)
    io.to(payload.userId)
      .emit('signal', {
        userId: socket.id,
        signal: payload.signal
      })
  })

  socket.on('getUserId', payload => {
    console.log(payload)
    io.to(payload.userId).emit('initUserId', socket.id)
  })

  socket.on('ready', roomName => {
    console.log('ready: %s, room: %s', socket.id, roomName)
    if (socket.room) socket.leave(socket.room)
    socket.room = roomName
    socket.join(roomName)
    socket.room = roomName

    let users = getUsers(roomName)
    console.log('ready: %s, room: %s, users: %o', socket.id, roomName, users)
    io.to(roomName).emit('users', {
      initiator: socket.id,
      users
    })
  })

  function getUsers (roomName) {
    return _.map(io.sockets.adapter.rooms[roomName].sockets, (_, id) => {
      return {id}
    })
  }
}
