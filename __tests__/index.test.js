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

nock.disableNetConnect()

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
    .get('/courses')
    .reply(200, expectedBody)

  nock(baseUrl)
    .get('/assets/professions/nodejs.png')
    .reply(200, imageData)

  await pageLoader('https://ru.hexlet.io/courses', tempDir)

  const testPic = await fsp.readFile(testPicPath)
  expect(imageData).toEqual(testPic)
  const testHTML = await fsp.readFile(testHTMLPath, 'utf-8')
  const expected = cheerio.load(expectedResult).html()
  const actual = cheerio.load(testHTML).html()
  expect(expected).toEqual(actual)
})
