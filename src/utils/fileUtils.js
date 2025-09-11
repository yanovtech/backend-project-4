import fsp from 'fs/promises'
import path from 'path'

const makeFile = async (fileName, data) => {
  try {
    console.log('[fileUtils] SAVE FILE AS:', fileName)
    await fsp.writeFile(fileName, data)
  }
  catch (error) {
    console.error(`Error writing file ${fileName}:\n   ${error.message}`)
    throw error
  }
}

const makeDir = async (dirName) => {
  try {
    console.log('[fileUtils] CREATE DIR:', dirName)
    await fsp.mkdir(dirName, { recursive: true })
  }
  catch (error) {
    console.error(`Error creating directory ${dirName}:\n   ${error.message}`)
    throw error
  }
}

const makeFileName = (url, ext = '') => {
  const { hostname, pathname } = new URL(url)
  const normalizedPath = pathname === '/' ? '/index' : pathname
  const name = `${hostname}${normalizedPath}`.replace(/[^a-zA-Z0-9]/g, '-')
  const fileName = `${name}${ext}`
  console.log('[fileUtils] makeFileName:', url, '→', fileName)
  return fileName
}

const makeResourceName = (baseUrl, resourceUrl) => {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const { hostname, pathname } = new URL(resourceUrl, normalizedBase)

  const ext = path.extname(pathname)
  const withoutExt = pathname.slice(0, -ext.length) || pathname

  const name = `${hostname}${withoutExt}`.replace(/[^a-zA-Z0-9]/g, '-')
  const fileName = `${name}${ext}`

  console.log('[fileUtils] makeResourceName:', resourceUrl, '→', fileName)
  return fileName
}

export { makeFile, makeDir, makeFileName, makeResourceName }
