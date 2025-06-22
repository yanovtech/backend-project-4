import * as cheerio from 'cheerio'
import path from 'path'
import { makeFileName } from './fileUtils.js'

const getLocalResources = (html, baseUrl) => {
  const $ = cheerio.load(html)
  const tags = [
    { tag: 'img', attr: 'src' },
    { tag: 'script', attr: 'src' },
    { tag: 'link', attr: 'href' },
  ]

  const resources = []

  tags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const rawLink = $(el).attr(attr)
      if (rawLink) {
        const absUrl = new URL(rawLink, baseUrl)
        if (absUrl.origin === new URL(baseUrl).origin) {
          resources.push({
            tag,
            attr,
            link: absUrl.href,
          })
        }
      }
    })
  })

  return resources
}

const updateResourceLinks = (html, baseUrl, assetsDir) => {
  const $ = cheerio.load(html)
  const tags = [
    { tag: 'img', attr: 'src' },
    { tag: 'script', attr: 'src' },
    { tag: 'link', attr: 'href' },
  ]

  tags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const rawLink = $(el).attr(attr)
      if (rawLink) {
        const absUrl = new URL(rawLink, baseUrl)
        if (absUrl.origin === new URL(baseUrl).origin) {
          const localFileName = makeFileName(absUrl.href)
          $(el).attr(attr, path.join(assetsDir, localFileName))
        }
      }
    })
  })

  return $.html()
}

export { getLocalResources, updateResourceLinks }
