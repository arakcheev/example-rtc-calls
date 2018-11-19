// Imports the Google Cloud client library
const speech = require('@google-cloud/speech')
const fs = require('fs')

// Creates a client
const client = new speech.v1p1beta1.SpeechClient({
  'email': 'artem.ft@gmail.com',
  'keyFilename': './config/Enraid-39275b3bafdb.json'
})

module.exports = function recognize (audioBytes, callback) {
  audioBytes = audioBytes.replace('data:audio/wav;base64,', '')
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes
  }
  const config = {
    encoding: 'LINEAR16',
    languageCode: 'en-US',
    audioChannelCount: 2
  }
  const request = {
    audio: audio,
    config: config
  }

// Detects speech in the audio file
  client.recognize(request).then(response => {
    const transcription = response[0].results
      .map(result => result.alternatives[0].transcript)
      .join('\n')

    if (transcription !== undefined && transcription.length > 0) {
      callback(transcription)
    }
    console.log(`Transcription: ${transcription}`)
  }).catch(error => {
    console.log('Error')
    console.log(error)
  })

}
