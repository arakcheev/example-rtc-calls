import SocketIOClient from 'socket.io-client'
import {baseUrl} from './window.js'

const socket = new SocketIOClient('', {path: baseUrl + '/ws'})
console.log('Socket connection is established')
export default socket
