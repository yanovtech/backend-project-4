import fs from 'fs'
import fsp from 'fs/promises'
import axios from 'axios'
import path from 'path'
import debug from 'debug'

const debugAxios = debug('axios')

const downloadImg = (url, imgPath, responseType = 'arraybuffer') => {
  debugAxios(`Starting download from ${url}`)

  return axios({ method: 'get', url, responseType, validateStatus: null })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`HTTP error ${response.status} while downloading resource: ${url}`)
      }

      return fsp.mkdir(path.dirname(imgPath), { recursive: true })
        .then(() => {
          if (responseType === 'stream') {
            return new Promise((resolve, reject) => {
              const writer = fs.createWriteStream(imgPath)
              response.data.pipe(writer)
              writer.on('finish', resolve)
              writer.on('error', reject)
            })
          }
          else {
            return fsp.writeFile(imgPath, response.data)
          }
        })
    })
    .then(() => {
      debugAxios(`Successfully downloaded: ${url}`)
    })
    .catch((error) => {
      console.error(`Error downloading resource from ${url}:\n${error.message}`)
      throw error
    })
}

const makeRequest = (url) => {
  debugAxios(`Requesting ${url}`)

  return axios.get(url)
    .catch((error) => {
      console.log('[makeRequest] Error caught:', error.message)
      throw error
    })
}

export { downloadImg, makeRequest }
