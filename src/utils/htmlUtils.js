import * as cheerio from 'cheerio'
import path from 'path'
import { makeFileName } from './fileUtils.js'

const supportedTags = [
  { tag: 'img', attr: 'src' },
  { tag: 'script', attr: 'src' },
  { tag: 'link', attr: 'href' },
]

const getLocalResources = (html, baseUrl) => {
  const $ = cheerio.load(html)
  const baseOrigin = new URL(baseUrl).origin

  const resources = []

  supportedTags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const raw = $(el).attr(attr)
      if (!raw) return

      const absoluteUrl = new URL(raw, baseUrl)
      if (absoluteUrl.origin === baseOrigin) {
        resources.push({
          tag,
          attr,
          link: absoluteUrl.href,
        })
      }
    })
  })

  return resources
}

const updateResourceLinks = (html, baseUrl, assetsDirName) => {
  const $ = cheerio.load(html)
  const baseOrigin = new URL(baseUrl).origin

  supportedTags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const raw = $(el).attr(attr)
      if (!raw) return

      const absoluteUrl = new URL(raw, baseUrl)
      if (absoluteUrl.origin === baseOrigin) {
        const localFileName = makeFileName(absoluteUrl.href)
        const localPath = path.join(assetsDirName, localFileName)
        $(el).attr(attr, localPath)
      }
    })
  })

  const pageFileName = makeFileName(baseUrl, '.html')
  const canonicalPath = path.join(assetsDirName, pageFileName)
  $('link[rel="canonical"]').attr('href', canonicalPath)

  return $.html()
}

export { getLocalResources, updateResourceLinks }
