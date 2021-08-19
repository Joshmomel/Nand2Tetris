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
  public vm = ''

  static virtualMachine = new Main()

  private generateCode() {
    try {
      const data = fs.readFileSync(filePath, 'utf-8')

      const parser = new Parser(data)
      const parsedCode = parser.parse()

      const codeWriter = new CodeWriter()
      this.vm = codeWriter.write(parsedCode)
    } catch (err) {
      console.log(err)
    }
  }

  private writeToFile() {
    const fileName = filePath.split('.')[0] + '.asm'
    fs.closeSync(fs.openSync(fileName, 'w'));
    fs.unlinkSync(fileName)
    fs.writeFileSync(fileName, this.vm)
  }

  run() {
    this.generateCode()
    this.writeToFile()
  }
}

export default Main
