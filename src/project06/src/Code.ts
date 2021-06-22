import { int2Binary } from './util/math';
import { compTable, destTable, jumpTable } from './util/instructionTable';
import SymbolTable from './SymbolTable';

class Code {
  private readonly parsedContent: ParserType[];
  private _codeList: CodeType[] = [];
  private coded = false;
  private symbolTable: SymbolTable;

  constructor(parsedContent: ParserType[], symbolTable: SymbolTable) {
    this.parsedContent = parsedContent;
    this.symbolTable = symbolTable;
  }

  private static isACommands(line: ParserType) {
    return line.content.includes('@');
  }

  private processACommand(line: ParserType) {
    let constant = line.content.substring(1).trim();

    if (isNaN(Number(constant))) {
      if (!this.symbolTable.hasVariable(constant)) {
        this.symbolTable.addVariable(constant);
      }
      constant = String(this.symbolTable.getSymbol(constant));
    }
    return int2Binary(constant);
  }

  private static processDest(line: ParserType) {
    const content = line.content;
    if (content.includes('=')) {
      let dest = content.split('=')[0].trim();
      return destTable[dest];
    } else {
      return '000';
    }
  }

  private static processComp(line: ParserType) {
    let content = line.content;

    if (content.includes('=')) {
      content = content.split('=')[1].trim();
    }

    if (content.includes(';')) {
      content = content.split(';')[0].trim();
    }

    return compTable[content];
  }

  private static processJump(line: ParserType) {
    let content = line.content;
    if (content.includes(';')) {
      content = content.split(';')[1].trim();
    }
    return jumpTable[content] ?? '000';
  }

  private static processCCommand(line: ParserType) {
    let binaryCode;
    const dest = Code.processDest(line);
    const comp = Code.processComp(line);
    const jump = Code.processJump(line);

    binaryCode = '111' + comp + dest + jump;

    return binaryCode;
  }

  private toCode() {
    this.coded = true;
    for (let i = 0; i < this.parsedContent.length; i++) {
      const command = this.parsedContent[i];
      if (Code.isACommands(command)) {
        const code = this.processACommand(command);
        this.codeList.push(code);
      } else {
        const code = Code.processCCommand(command);
        this.codeList.push(code);
      }
    }
  }

  get codeList() {
    if (!this.coded) this.toCode();
    return this._codeList;
  }
}

export default Code;
