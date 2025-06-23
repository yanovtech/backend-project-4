import path from 'path'
import pageLoader from '../src/index.js'
import nock from 'nock'
import fsp from 'fs/promises'
import os from 'os'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const getFixturePath = name => path.join(dirname, '..', '__fixtures__', name)

const tempDir = os.tmpdir()
const testHTMLPath = path.join(tempDir, 'ru-hexlet-io-courses.html')
const testDirPath = path.join(tempDir, 'ru-hexlet-io-courses_files')
const testPicPath = path.join(testDirPath, 'ru-hexlet-io-assets-professions-nodejs.png')

const normalizeHtml = html => cheerio.load(html).html().replace(/\s+/g, ' ').trim()

nock.cleanAll()
nock.disableNetConnect()
nock.emitter.on('no match', (req) => {
  console.error('NO MATCH:', req)
})

beforeEach(async () => {
  await fsp.unlink(testHTMLPath).catch(() => {})
  await fsp.rm(testDirPath, { recursive: true, force: true }).catch(() => {})
})

test('pageLoader', async () => {
  const baseUrl = 'https://ru.hexlet.io'
  const expectedBodyPath = getFixturePath('before.html')
  const expectedBody = await fsp.readFile(expectedBodyPath, 'utf-8')
  const expectedResultPath = getFixturePath('after.html')
  const expectedResult = await fsp.readFile(expectedResultPath, 'utf-8')
  const imageDataPath = getFixturePath('testImg.png')
  const imageData = await fsp.readFile(imageDataPath)

  nock(baseUrl)
    .persist()
    .get('/courses')
    .reply(200, expectedBody)
    .get('/assets/professions/nodejs.png')
    .reply(200, imageData)
    .get('/assets/application.css')
    .reply(200, 'done')
    .get('/packs/js/runtime.js')
    .reply(200, 'done')

  await pageLoader('https://ru.hexlet.io/courses', tempDir, 'arraybuffer')

  const testPic = await fsp.readFile(testPicPath)
  expect(testPic).toEqual(imageData)

  const testHTML = await fsp.readFile(testHTMLPath, 'utf-8')
  const expected = normalizeHtml(expectedResult)
  const actual = normalizeHtml(testHTML)
  expect(actual).toEqual(expected)
})
