/**
 * Main: drives the process (VMTranslator)
 *
 * Constructs a Parser to handle the input file
 * Constructs a CodeWriter to handle the output file
 * Marches through the input file, parsing each line and generating code from it
 */

import fs from 'fs'
import { filePath } from './util/utils'
import { Parser } from './Parser'
import CodeWriter from './CodeWriter'

class Main {
  public vm: string

  constructor() {
    this.vm = ''
  }

  static virtualMachine = new Main()

  private generateCode() {
    console.log('filePath is ', filePath)
    const isDirectory = fs.lstatSync(filePath).isDirectory()
    if (isDirectory) {
      const files = fs.readdirSync(filePath)

      const hasSysInit = files.indexOf('Sys.vm')
      const codeWriter = new CodeWriter()

      if (hasSysInit) {
        this.vm += codeWriter.writeInit()
      }

      // console.log('files are', files)
      for (let i = 0; i < files.length; i++) {
        console.log('file is', files[i])
        let fileArray = files[i].split('.')
        if (fileArray[1] === 'vm') {
          try {
            const fileName = fileArray[0]
            console.log('filename is ', fileName)
            const path = `${filePath}/${files[i]}`
            const data = fs.readFileSync(path, 'utf-8')

            const parser = new Parser(data)
            const parsedCode = parser.parse()
            CodeWriter.setFileName(fileName)
            const out = codeWriter.write(parsedCode)

            this.vm += out
          } catch (err) {
            console.log(err)
          }
        }
      }
    } else {
      try {
        const data = fs.readFileSync(filePath, 'utf-8')
        const codeWriter = new CodeWriter()
        const parser = new Parser(data)
        const parsedCode = parser.parse()

        this.vm += codeWriter.write(parsedCode)
      } catch (err) {
        console.log(err)
      }
    }
  }

  private writeToFile() {
    const fileName = filePath.split('.')[0] + '.asm'
    console.log('file name is', fileName)
    fs.closeSync(fs.openSync(fileName, 'w'))
    fs.unlinkSync(fileName)
    fs.writeFileSync(fileName, this.vm)
  }

  run() {
    this.generateCode()
    this.writeToFile()
  }
}

export default Main
