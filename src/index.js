import path from 'path'
import { makeFile, makeDir, makeFileName } from './utils/fileUtils.js'
import { getLocalResources, updateResourceLinks } from './utils/htmlUtils.js'
import { downloadImg, makeRequest } from './utils/httpUtils.js'

export default (url, dir) => {
  const htmlFileName = makeFileName(url, '.html')
  const assetsDirName = makeFileName(url, '_files')

  return makeRequest(url)
    .then(({ data }) => {
      const originalHtml = data
      const resources = getLocalResources(originalHtml, url)
      const updatedHtml = updateResourceLinks(originalHtml, url, assetsDirName)

      const saveHtml = makeFile(path.join(dir, htmlFileName), updatedHtml)
      const createAssetsDir = makeDir(path.join(dir, assetsDirName))

      return Promise.all([saveHtml, createAssetsDir]).then(() => resources)
    })
    .then((resources) => {
      return Promise.all(resources.map(({ link }) => {
        const fileName = makeFileName(link)
        const filePath = path.join(dir, assetsDirName, fileName)
        return downloadImg(link, filePath)
      }))
    })
    .catch(err => console.error('Error:', err))
}
