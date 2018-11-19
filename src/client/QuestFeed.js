/* eslint-disable max-len */
import SocketIOClient from 'socket.io-client'

const io = SocketIOClient('/quest-feed', {path: '/ws'})

const table = document.getElementById('results')

const usersColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info']
let userColorIndex = 0
const userColorTable = {}

function getUserColor (userId) {
  if (userColorTable[userId] !== undefined) {
    return userColorTable[userId]
  } else if (userColorIndex < usersColors.length) {
    let color = usersColors[userColorIndex]
    userColorIndex += 1
    userColorTable[userId] = color
    return color
  } else {
    return ''
  }
}

io.on('transcribe', function (data) {
  const text = data.text
  const user = data.user

  const tr = document.createElement('tr')
  tr.className += getUserColor(user)
  const td = document.createElement('td')
  td.innerText = text
  tr.appendChild(td)
  table.appendChild(tr)
})
