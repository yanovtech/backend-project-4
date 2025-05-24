import axios from 'axios'
import fsp from 'fs/promises'
import path from 'path'

const makeFileName = (url) => {
  const regexp = /[^\w]/g
  const urlWithOutProtocol = url.split('://')[1]
  return `${urlWithOutProtocol.split(regexp).join('-')}.html`
}

const makeRequest = url => axios.get(url)

const makeFile = (fileName, data) => fsp.writeFile(fileName, data)

export default (url, dir) => {
  const fileName = makeFileName(url)
  return makeRequest(url).then(({ data }) => makeFile(path.join(dir, fileName), data))
}
