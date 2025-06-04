import axios from 'axios'
import fsp from 'fs/promises'
import path from 'path'
import * as cheerio from 'cheerio'
import fs from 'fs'

const getImagesLink = (html, url) => {
  const $ = cheerio.load(html)
  const imgSrcList = []
  $('img').each((i, el) => {
    const src = $(el).attr('src')
    if (src) {
      imgSrcList.push(src)
    }
  })
  return imgSrcList.map(imgSrc => new URL(imgSrc, url).href)
}

const updateImageSources = (html, url, dirName) => {
  const $ = cheerio.load(html)
  $('img').each((i, el) => {
    const src = $(el).attr('src')
    if (src) {
      const absoluteUrl = new URL(src, url).href
      const localFileName = makeFileName(absoluteUrl)
      $(el).attr('src', path.join(dirName, localFileName))
    }
  })
  return $.html()
}

export const makeFileName = (url, acceptedFormat = null) => {
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

const findFormat = (file) => {
  const parts = file.split('.')
  const fileName = parts.slice(0, -1).join('.')
  const format = parts.at(-1)
  return { fileName, format }
}

const makeRequest = url => axios({ method: 'get', url: url })

const makeFile = (fileName, data) => fsp.writeFile(fileName, data)

const makeDir = dirName => fsp.mkdir(dirName)

const downloadImg = (url, imgName) => {
  return axios({ method: 'get', url: url, responseType: 'stream' })
    .then(({ data }) => {
      const writer = fs.createWriteStream(imgName)
      return new Promise((resolve, reject) => {
        data.pipe(writer)
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    })
}

export const pageLoader = (url, dir) => {
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
