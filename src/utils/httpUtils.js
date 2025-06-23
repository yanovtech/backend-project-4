import fs from 'fs'
import fsp from 'fs/promises'
import axios from 'axios'
import path from 'path'

const downloadImg = (url, imgName, responseType = 'arraybuffer') => {
  return axios({ method: 'get', url, responseType }).then((response) => {
    return fsp.mkdir(path.dirname(imgName), { recursive: true }).then(() => {
      if (responseType === 'stream') {
        return new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(imgName)
          response.data.pipe(writer)
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      }
      else {
        return fsp.writeFile(imgName, response.data)
      }
    })
  })
}

const makeRequest = url => axios({ method: 'get', url })

export { downloadImg, makeRequest }
