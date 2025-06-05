import fsp from 'fs/promises'

const makeFile = (fileName, data) => fsp.writeFile(fileName, data)

const makeDir = dirName => fsp.mkdir(dirName)

const findFormat = (file) => {
  const parts = file.split('.')
  const fileName = parts.slice(0, -1).join('.')
  const format = parts.at(-1)
  return { fileName, format }
}

const makeFileName = (url, acceptedFormat = null) => {
  const regexp = /[^\w]/g
  const urlWithOutProtocol = url.split('://')[1]
  if (acceptedFormat) {
    return `${urlWithOutProtocol.split(regexp).join('-')}${acceptedFormat}`
  }
  else {
    const { fileName, format } = findFormat(urlWithOutProtocol)
    return `${fileName.split(regexp).join('-')}.${format}`
  }
}

export { makeFile, makeDir, makeFileName }
