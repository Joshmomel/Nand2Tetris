/**
 * Input: a single fileName.jack or a directory
 * For each file
 * 1. Creates a Tokenizer from fileName.jack
 * 2. Creates an output file name fileName.xml and prepares it for writing
 * 3. Creates and uses a Compilation Engine to compile the input Tokenizer into the output file
 */
import fs from 'fs'
import { filePath, printTreeString } from './utils/utils'
import Tokenizer from './Tokenizer'
import XmlPrinter from './utils/xmlPrinter'
import CompilationEngine from './CompilationEngine'

class Analyzer {
  public xmlT: string
  public xml: string
  static analyzer = new Analyzer()

  constructor() {
    this.xmlT = ''
    this.xml = ''
  }

  private generateCode() {
    const isDirectory = fs.lstatSync(filePath).isDirectory()
    if (isDirectory) {
      const files = fs.readdirSync(filePath)

      for (let i = 0; i < files.length; i++) {
        console.log('file is ', files[i])
        let fileArray = files[i].split('.')
        if (fileArray[1] === 'jack') {
          try {
            const path = `${filePath}/${files[i]}`
            const content = fs.readFileSync(path, 'utf-8')

            const tokens = Tokenizer.analyse(content)
            this.xmlT = XmlPrinter.printIntermediate(tokens)
            // Analyzer.writeToFile(path, this.xmlT)

            const parentNode = CompilationEngine.analyse(tokens)!
            const fileName = path.split('.')[0] + '.xml'

            fs.closeSync(fs.openSync(fileName, 'w'))
            fs.unlinkSync(fileName)
            printTreeString(parentNode, 0, fileName)
          } catch (err) {
            new Error('generate code error')
          }
        }
      }
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const tokens = Tokenizer.analyse(content)
        this.xmlT = XmlPrinter.printIntermediate(tokens)
        Analyzer.writeToFile(filePath, this.xmlT)

        const parentNode = CompilationEngine.analyse(tokens)!
        const fileName = filePath.split('.')[0] + '.xml'

        fs.closeSync(fs.openSync(fileName, 'w'))
        fs.unlinkSync(fileName)
        printTreeString(parentNode, 0, fileName)
      } catch (err) {
        new Error('generate code error')
      }
    }
  }

  private static writeToFile(filePath: string, content: string) {
    const fileName = filePath.split('.')[0] + '.xml'
    console.log('file name is', fileName)
    fs.closeSync(fs.openSync(fileName, 'w'))
    fs.unlinkSync(fileName)
    fs.writeFileSync(fileName, content)
  }

  run() {
    this.generateCode()
  }
}

export default Analyzer
