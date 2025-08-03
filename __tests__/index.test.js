import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import nock from 'nock'
import pageLoader from '../src/index.js'
import { readFixture, getAssetPath } from '../__helpers__/utils.js'

let tmpDir

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

test('pageLoader is successfully triggered', async () => {
  const html = await readFixture('ru-hexlet-io-courses.html')
  const image = await fs.readFile(getAssetPath('assets-nodejs.png'))

  nock('https://ru.hexlet.io')
    .get('/courses').reply(200, html)

  nock('https://ru.hexlet.io')
    .get('/assets/assets-nodejs.png').reply(200, image)

  await pageLoader('https://ru.hexlet.io/courses', tmpDir)

  const downloadedHtmlPath = path.join(tmpDir, 'ru-hexlet-io-courses.html')
  const downloadedImgPath = path.join(tmpDir, 'ru-hexlet-io-courses_files', 'assets-nodejs.png')

  const downloadedHtml = await fs.readFile(downloadedHtmlPath, 'utf-8')
  const downloadedImg = await fs.readFile(downloadedImgPath)

  expect(downloadedHtml).toContain('ru-hexlet-io-courses_files/assets-nodejs.png')
  expect(downloadedImg).toEqual(image)
})

test('should throw error on HTTP 404', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses').reply(404)

  await expect(pageLoader('https://ru.hexlet.io/courses', tmpDir)).rejects.toThrow('404')
})

test('should throw error when writing to a non-existent directory', async () => {
  const html = await readFixture('ru-hexlet-io-courses.html')

  nock('https://ru.hexlet.io')
    .get('/courses').reply(200, html)

  const badDir = '/nonexistent/folder/output'

  await expect(pageLoader('https://ru.hexlet.io/courses', badDir)).rejects.toThrow(/ENOENT/)
})
