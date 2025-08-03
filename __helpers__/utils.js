import path from 'path'
import fs from 'fs/promises'

export const getFixturePath = filename => path.join('__fixtures__', filename)

export const readFixture = filename => fs.readFile(getFixturePath(filename), 'utf-8')

export const getAssetPath = filename => path.join('__fixtures__', 'assets', filename)
