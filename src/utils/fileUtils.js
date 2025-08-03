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
  const name = `${hostname}${normalizedPath}`.replace(/[^a-zA-Z0-9]/g, '-')
  return `${name}${ext}`
}

const makeResourceName = (baseUrl, resourceUrl) => {
  const { hostname: baseHost, pathname: basePath } = new URL(baseUrl)
  const resourceAbsUrl = new URL(resourceUrl, baseUrl)
  const { pathname: resourcePath } = resourceAbsUrl

  const relativePath = resourcePath.startsWith(basePath)
    ? resourcePath.slice(basePath.length)
    : resourcePath

  const normalizedPath = relativePath === '/' || relativePath === ''
    ? 'index'
    : relativePath.replace(/^\/+/, '')

  const name = `${baseHost}-${normalizedPath}`.replace(/[^a-zA-Z0-9]/g, '-')
  return name
}

export { makeFile, makeDir, makeFileName, makeResourceName }
