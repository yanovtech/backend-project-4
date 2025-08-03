import path from 'path'
import { makeFile, makeDir, makeFileName } from './utils/fileUtils.js'
import { getLocalResources, updateResourceLinks } from './utils/htmlUtils.js'
import { downloadImg, makeRequest } from './utils/httpUtils.js'
import debug from 'debug'

const debugPageLoader = debug('page-loader')

export default (url, dir, responseType = 'arraybuffer') => {
  const htmlFileName = makeFileName(url, '.html')
  const assetsDirName = makeFileName(url, '_files')

  return makeRequest(url)
    .then((response) => {
      const originalHtml = response.data
      const resources = getLocalResources(originalHtml, url)
      const updatedHtml = updateResourceLinks(originalHtml, url, assetsDirName)

      const htmlPath = path.join(dir, htmlFileName)
      const assetsPath = path.join(dir, assetsDirName)

      debugPageLoader(`Create file ${htmlFileName} and ${assetsDirName}`)

      return Promise.all([
        makeFile(htmlPath, updatedHtml),
        makeDir(assetsPath),
      ])
        .then(() => {
          debugPageLoader(`Resources are being downloaded in ${assetsDirName}`)
          return Promise.all(
            resources.map(({ link }) => {
              const fileName = path.basename(link)
              const filePath = path.join(assetsPath, fileName)
              return downloadImg(link, filePath, responseType)
            })
          )
        })
    })
    .catch((err) => {
      console.error('Error:', err)
      throw err
    })
}
