import * as cheerio from 'cheerio'
import path from 'path'
import { makeFileName } from './fileUtils.js'

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

export { getImagesLink, updateImageSources }
