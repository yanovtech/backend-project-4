import path from 'path'
import { pageLoader } from '../src/index.js'
import nock from 'nock'
import fsp from 'fs/promises'
import os from 'os'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const getFixturePath = name => path.join(dirname, '..', '__fixtures__', name)

const testDir = os.tmpdir()
const testFile = path.join(testDir, 'ru-hexlet-io-courses.html')

nock.disableNetConnect()

beforeEach(async () => await fsp.unlink(testFile).catch(() => {}))

test('pageLoader', async () => {
  const expectedBodyPath = getFixturePath('before.html')
  const expectedBody = await fsp.readFile(expectedBodyPath, 'utf-8')
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expectedBody)

  await pageLoader('https://ru.hexlet.io/courses', testDir)
  const body = await fsp.readFile(testFile, 'utf-8')
  expect(body).toEqual(expectedBody)
})
