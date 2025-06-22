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

      const htmlPath = path.join(dir, htmlFileName)
      const assetsPath = path.join(dir, assetsDirName)

      return Promise.all([
        makeFile(htmlPath, updatedHtml),
        makeDir(assetsPath),
      ]).then(() => resources)
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
