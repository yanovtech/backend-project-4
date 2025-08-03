import fs from 'fs'
import fsp from 'fs/promises'
import axios from 'axios'
import path from 'path'
import debug from 'debug'
import Listr from 'listr'

const debugAxios = debug('axios')

const downloadImg = (url, imgPath, responseType = 'arraybuffer') => {
  debugAxios(`Starting download from ${url}`)

  return new Listr([
    {
      title: `Скачивание ресурса: ${url}`,
      task: () =>
        axios({ method: 'get', url, responseType, validateStatus: null })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(`HTTP error ${response.status} while downloading resource: ${url}`)
            }

            if (responseType === 'stream') {
              return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(imgPath)
                response.data.pipe(writer)
                writer.on('finish', resolve)
                writer.on('error', reject)
              })
            }

            return fsp.writeFile(imgPath, response.data)
          }),
    },
  ]).run()
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
