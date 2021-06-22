import strip from 'strip-comments';
import SymbolTable from './SymbolTable';

class Parser {
  private content;
  private parsed = false;
  private symbolTable;
  private _parsedContent: ParserType[] = [];

  constructor(content: string, symbolTable: SymbolTable) {
    this.parsed = false;
    this.content = content;
    this.symbolTable = symbolTable;
  }

  private firstPass(instruction: ParserType): hasSetLabel {
    if (instruction.content[0] === '(') {
      const symbol = instruction.content.replace('(', '').replace(')', '');
      this.symbolTable.addLabel(symbol, instruction.line);
      // console.log(`add label ${symbol} at line ${instruction.line}`);
      return true;
    }
    return false;
  }

  private parse() {
    this.parsed = true;
    const lines = this.content.split(/\r?\n/);

    // print all lines
    let lineNum = 0;
    lines.forEach((line) => {
      const content = strip(line).trim();
      if (content.length === 0) return;
      const instruction = { line: lineNum, content };
      // firstPass
      const hasSetLabel = this.firstPass(instruction);

      if (!hasSetLabel) {
        this.parsedContent.push(instruction);
        lineNum++;
      }
    });
  }

  get parsedContent() {
    if (!this.parsed) this.parse();
    return this._parsedContent;
  }
}

export default Parser;
