#!/usr/bin/env node
import { Command } from 'commander'
import pageLoader from '../src/index.js'
import { makeFileName } from '../src/utils/fileUtils.js'

const program = new Command()

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .arguments('<url>')
  .action((url, options) => {
    pageLoader(url, options.output)
      .then(() => console.log(`open ${options.output}/${makeFileName(url, '.html')}`))
  })
  .parse()
