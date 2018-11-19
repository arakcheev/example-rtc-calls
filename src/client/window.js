import Promise from 'bluebird'
import _debug from 'debug'
import AudioProcessor from './AudioProcessor.js'

const debug = _debug('peercalls')

export function GetAudioContext () {
  let AudioContextConstructor = window.AudioContext || window.webkitAudioContext
  return new AudioContextConstructor()
}

export function UserMedia (constraints) {
  return getUserMedia(constraints).then(media => {
    try {
      const audioContext = GetAudioContext()
      const audioSource = audioContext.createMediaStreamSource(media)

      const processorNode = (audioContext.createScriptProcessor ||
        audioContext.createJavaScriptNode).call(audioContext,
        1024, 2, 2)

      window.audioProcessor = new AudioProcessor(audioSource, 3)
      // window.audioProcessor.start()

      audioSource.connect(processorNode)
      processorNode.connect(audioContext.destination)
    } catch (e) {
      console.error(e)
    }

    return media
  })
}

/**
 * //TODO: Add possibility to separate video and audio streams
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters
 * @param constraints
 * @returns {Promise<MediaStream>}
 */
function getUserMedia (constraints) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints)
  }

  return new Promise((resolve, reject) => {
    const getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
    if (!getMedia) reject(new Error('Browser unsupported'))
    // call getMedia with constrains and success, error callbacks
    getMedia.call(navigator, constraints, resolve, reject)
  })
}

export const createObjectURL = object => window.URL.createObjectURL(object)
export const revokeObjectURL = url => window.URL.revokeObjectURL(url)

export const navigator = window.navigator

export function play () {
  let videos = window.document.querySelectorAll('video')
  Array.prototype.forEach.call(videos, (video, index) => {
    debug('playing video: %s', index)
    try {
      video.play()
    } catch (e) {
      debug('error playing video: %s', e.name)
    }
  })
}

export const valueOf = id => {
  const el = window.document.getElementById(id)
  return el && el.value
}

export const baseUrl = valueOf('baseUrl')
export const callId = valueOf('callId')
export const iceServers = JSON.parse(valueOf('iceServers'))

export const MediaStream = window.MediaStream
