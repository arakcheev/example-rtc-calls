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
    io.to(payload.userId)
      .emit('signal', {
        userId: socket.id,
        signal: payload.signal
      })
  })

  socket.on('getUserId', payload => {
    io.to(payload.userId).emit('initUserId', socket.id)
  })

  socket.on('ready', roomName => {
    if (socket.room) socket.leave(socket.room)
    socket.room = roomName
    socket.join(roomName)
    socket.room = roomName

    let users = getUsers(roomName)
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
