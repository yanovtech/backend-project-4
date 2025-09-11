import fsp from 'fs/promises'
import path from 'path'

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
  const name = `${hostname}${normalizedPath}`.replace(/[^a-zA-Z0-9]/g, '-')
  return `${name}${ext}`
}

const makeResourceName = (baseUrl, resourceUrl) => {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const { hostname, pathname } = new URL(resourceUrl, normalizedBase)
  const ext = path.extname(pathname)
  const withoutExt = pathname.slice(0, -ext.length) || pathname
  const name = `${hostname}${withoutExt}`.replace(/[^a-zA-Z0-9]/g, '-')
  return `${name}${ext}`
}

export { makeFile, makeDir, makeFileName, makeResourceName }
