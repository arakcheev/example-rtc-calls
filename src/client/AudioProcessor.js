import Recorder from './Recorder'

const axios = require('axios')

class AudioSender {
  constructor (url) {
    this.url = url

    this.params = (data) => {
      return {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`
        }
      }
    }
  }

  _convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

  sendAsBase64 = (blob) => {
    this._convertBlobToBase64(blob).then(encoded => {

      const dataToSend = {
        'data': encoded,
        'userId': 'as'
      }

      axios.post(this.url, dataToSend).then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
    }).catch(error => {
      console.log('error encode' + error)
    })
  }

  send = (blob) => {
    let data = new FormData()
    data.append('file', blob, 'speech')
    axios.post(this.url, data, this.params(data)).then((result) => {
      console.log(result)
    }).catch((error) => {
      console.log(error)
    })
  }
}

export default class AudioProcessor {
  constructor (audioSource, recordInterval) {
    this.audioSource = audioSource
    this.recordInterval = recordInterval

    this.recording = false

    this.recorder = new Recorder(this.audioSource, {numChannels: 1})

    this.audioSender = new AudioSender('/speech')

    // TODO add some time shifts to avoid speech api limits
    setInterval(() => {
      this._processData()
    }, recordInterval * 1000)
  }

  start () {
    this.recording = true
    this.recorder.record()
  }

  stop () {
    this.recording = false
  }

  _processData () {
    if (!this.recording) return
    this.recorder.exportWAV(this._recordCallback)
    this.recorder.clear()
  }

  _recordCallback = (wavBlob) => {
    // this.audioSender.send(wavBlob)
    this.audioSender.sendAsBase64(wavBlob)
  }

  _appendToHtml = (wavBlob) => {
    let url = URL.createObjectURL(wavBlob)
    let au = document.createElement('audio')
    au.controls = true
    au.src = url

    let li = document.createElement('li')
    li.appendChild(au)
    document.getElementById('results').appendChild(li)

    document.getElementById('stop').onclick = function () {
      window.audioProcessor.stop()
    }
  }
}
