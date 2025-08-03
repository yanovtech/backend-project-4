import fsp from 'fs/promises'

const makeFile = (fileName, data) => {
  return fsp.writeFile(fileName, data)
    .catch((error) => {
      console.error(`Error writing file ${fileName}:\n   ${error.message}`)
      throw error
    })
}

const makeDir = (dirName) => {
  return fsp.mkdir(dirName, { recursive: true })
    .catch((error) => {
      console.error(`Error creating directory ${dirName}:\n   ${error.message}`)
      throw error
    })
}

const makeFileName = (url, ext = '') => {
  const { hostname, pathname } = new URL(url)
  const normalizedPath = pathname === '/' ? '/index' : pathname
  const fullPath = `${hostname}${normalizedPath}`
  const name = fullPath.replace(/[^a-zA-Z0-9]/g, '-')
  return `${name}${ext}`
}

export { makeFile, makeDir, makeFileName }
