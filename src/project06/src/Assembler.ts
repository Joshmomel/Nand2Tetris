import fs from 'fs';
import Parser from './Parser';
import Code from './Code';
import SymbolTable from './SymbolTable';

const filePath = process.argv[2];

class Assembler {
  private codeGenerated: CodeType[] = [];

  private generateCode() {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const symbolTable = new SymbolTable();
      const parser = new Parser(data, symbolTable);
      const code = new Code([...parser.parsedContent], symbolTable);
      this.codeGenerated = code.codeList;
    } catch (err) {
      console.log(err);
    }
  }

  private writeToFile() {
    const fileName = filePath.split('.')[0] + '.hack'
    fs.unlinkSync(fileName);
    this.codeGenerated.forEach((code) => {
      fs.appendFileSync(fileName, code + '\n');
    });
  }

  run() {
    this.generateCode();
    this.writeToFile();
  }
}

const assembler = new Assembler();

export default assembler;
