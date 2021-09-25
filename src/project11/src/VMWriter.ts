type BaseSegment = 'argument' | 'local' | 'static' | 'this' | 'that' | 'pointer' | 'temp'

export type PushSegment = BaseSegment | 'constant'
export type PopSegment = BaseSegment

export type ArithmeticCommand = 'ADD' | 'SUB' | 'NEG' | 'EQ' | 'GT' | 'LT' | 'AND' | 'OR' | 'NOT'

class VMWriter {
  private output: string;

  constructor() {
    this.output = ''
  }

  toString() {
    return this.output
  }

  writePush(segment: PushSegment, index: number) {
    this.output += `push ${segment} ${index}\n`
  }

  writePop(segment: PopSegment, index: number) {
    this.output += `pop ${segment} ${index}\n`
  }

  writeArithmetic(command: ArithmeticCommand) {
    this.output += command + '\n'
  }

  writeLabel(label: string) {
    this.output += `label ${label}\n`
  }

  writeGoto(label: string) {
    this.output += `goto ${label}\n`
  }

  writeIf(label: string) {
    this.output += `if-goto ${label}\n`
  }

  writeCall(name: string, nArgs: number) {
    this.output += `call ${name} ${nArgs}\n`
  }

  writeFunction(name: string, nLocal: number) {
    this.output += `function ${name} ${nLocal}\n`
  }

  writeReturn() {
    this.output += `return\n`
  }

}

export default VMWriter
