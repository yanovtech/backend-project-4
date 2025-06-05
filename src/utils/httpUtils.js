import fs from 'fs'
import axios from 'axios'

const downloadImg = (url, imgName) => {
  return axios({ method: 'get', url: url, responseType: 'stream' })
    .then(({ data }) => {
      const writer = fs.createWriteStream(imgName)
      return new Promise((resolve, reject) => {
        data.pipe(writer)
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    })
}

const makeRequest = url => axios({ method: 'get', url: url })

export { downloadImg, makeRequest }
