import path from 'path'
import { makeFile, makeDir, makeFileName } from './utils/fileUtils.js'
import { getImagesLink, updateImageSources } from './utils/htmlUtils.js'
import { downloadImg, makeRequest } from './utils/httpUtils.js'

export default (url, dir) => {
  const htmlFileName = makeFileName(url, '.html')
  const assetsDirName = makeFileName(url, '_files')

  return makeRequest(url)
    .then(({ data }) => {
      const originalHtml = data
      const imgLinks = getImagesLink(originalHtml, url)
      const updatedHtml = updateImageSources(originalHtml, url, assetsDirName)

      const saveHtmlPromise = makeFile(path.join(dir, htmlFileName), updatedHtml)
      const makeAssetsDirPromise = makeDir(path.join(dir, assetsDirName))

      return Promise.all([saveHtmlPromise, makeAssetsDirPromise])
        .then(() => imgLinks)
    })
    .then((imgLinks) => {
      return Promise.all(imgLinks.map((link) => {
        const imgName = makeFileName(link)
        const imgPath = path.join(dir, assetsDirName, imgName)
        return downloadImg(link, imgPath)
      }))
    })
    .catch(err => console.error('Error:', err))
}
