import path from 'path'
import pageLoader from '../src/index.js'
import nock from 'nock'
import fsp from 'fs/promises'
import os from 'os'

nock.disableNetConnect()

const testDir = os.tmpdir()
const testFile = path.join(testDir, 'ru-hexlet-io-courses.html')

beforeEach(async () => await fsp.unlink(testFile).catch(() => {}))

test('pageLoader', async () => {
  const expectedBody = await fsp.readFile(`${process.cwd()}/__fixtures__/before.html`, 'utf-8')
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expectedBody)

  await pageLoader('https://ru.hexlet.io/courses', testDir)
  const body = await fsp.readFile(testFile, 'utf-8')
  expect(body).toEqual(expectedBody)
})
