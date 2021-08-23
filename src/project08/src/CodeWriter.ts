import {
  allCommands,
  ArithmeticType,
  FunctionCallCommands,
  FunctionCallType,
  isArithmeticCommand,
  isFunctionCallCommand,
  isProgramFlowCommand,
  isPushPopCommand,
  ParseProgramFlowCommands,
  ProgramFlowType,
  PushPopType,
  Segment
} from './util/commandType'
import { printCommand } from './util/utils'
import { getSegmentVar } from './util/constants'
import {
  D_sub_by_M, set_SP_pointer_value_equal_to_D,
  SP_AND_D,
  SP_decrease,
  SP_EQ,
  SP_GT,
  SP_increase,
  SP_LT,
  SP_NOT_D,
  SP_OR_D,
  SP_pointer_add_D,
  SP_pointer_neg,
  SP_pointer_sub_by_D, SP_SET_TO_0,
  store_SP_pointer_to_D
} from './util/commonVMCodes'

class CodeWriter {
  index = 0
  callIndex = 0
  static fileName = ''

  constructor() {
    this.index = 0
    this.callIndex = 0
  }

  static arithmeticCode = (index: number) => ({
    ADD: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...SP_pointer_add_D,
      ...SP_increase
    ],
    SUB: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...SP_pointer_sub_by_D,
      ...SP_increase
    ],
    NEG: [...SP_decrease, ...SP_pointer_neg, ...SP_increase],
    EQ: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_EQ(index),
      ...SP_increase
    ],
    GT: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_GT(index),
      ...SP_increase
    ],
    LT: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_LT(index),
      ...SP_increase
    ],
    AND: [...SP_decrease, ...store_SP_pointer_to_D, ...SP_decrease, ...SP_AND_D, ...SP_increase],
    OR: [...SP_decrease, ...store_SP_pointer_to_D, ...SP_decrease, ...SP_OR_D, ...SP_increase],
    NOT: [...SP_decrease, ...SP_NOT_D, ...SP_increase]
  })

  private static processConstant(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    out.push(printCommand(command, segment, index))
    out.push(...[`@${index}`, 'D=A', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1'])

    return out
  }

  private static processSegment(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    const segmentVar = getSegmentVar(segment)
    out.push(printCommand(command, segment, index))

    if (command === 'C_POP') {
      /***
       * addr = LCL+i
       * SP--
       * *addr = *SP
       */
      const addr = [`@${segmentVar}`, `D=A`, `@${index}`, `D=M+D`, `@addr`, `M=D`] // perform i + segmentVar, store it to addr

      out.push(...addr, ...SP_decrease, ...store_SP_pointer_to_D, `@addr`, `A=M`, `M=D`)
    } else if (command === 'C_PUSH') {
      /***
       * addr = LCL+i
       * *SP = *addr
       * SP++
       */
      const addr = [`@${segmentVar}`, `D=M`, `@${index}`, `A=D+A`] // A points to *addr
      out.push(...addr, `D=M`, `@SP`, `A=M`, `M=D`, ...SP_increase)
    }

    return out
  }

  private static precessTemp(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    out.push(printCommand(command, segment, index))

    if (command === 'C_POP') {
      const addr = [`@R5`, `D=A`, `@${index}`, `D=A+D`, `@R13`, `M=D`]
      out.push(...addr, ...SP_decrease, ...store_SP_pointer_to_D, `@R13`, `A=M`, `M=D`)

    } else if (command === 'C_PUSH') {
      const addr = [`@R5`, `D=A`, `@${index}`, `A=A+D`]
      out.push(...addr, `@SP`, `A=M`, `M=D`, ...SP_increase)
    }

    return out
  }

  private static processStatic(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    out.push(printCommand(command, segment, index))

    if (command === 'C_POP') {
      out.push(...[`@SP`, `M=M-1`, `@SP`, `A=M`, `D=M`, `@${CodeWriter.fileName}.${index}`, `M=D`])
    } else if (command === 'C_PUSH') {
      out.push(...[`@${CodeWriter.fileName}.${index}`, `D=M`, `@SP`, `A=M`, `M=D`, `@SP`, `M=M+1`])
    }

    return out
  }

  private static processPointer(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    const pointer = Number(index) ? 'THAT' : 'THIS'

    out.push(printCommand(command, segment, index))
    if (command === 'C_POP') {
      out.push(
        ...[`@${pointer}`, `D=A`, `@R13`, `M=D`, `@SP`, `AM=M-1`, `D=M`, `@R13`, `A=M`, `M=D`]
      )
    } else if (command === 'C_PUSH') {
      out.push(...[`@${pointer}`, `D=M`, `@SP`, `A=M`, `M=D`, `@SP`, `M=M+1`])
    }

    return out
  }

  writeArithmetic(command: ArithmeticType): string[] {
    const out: string[] = []
    out.push(printCommand(command, 'N/A', 'n/A'))
    out.push(...CodeWriter.arithmeticCode(this.index++)[command])

    return out
  }

  static writePushPop(command: PushPopType, segment: Segment, index: number): string[] {
    switch (segment) {
      case 'CONSTANT':
        return CodeWriter.processConstant(command, segment, index)

      case 'LOCAL':
      case 'ARGUMENT':
      case 'THIS':
      case 'THAT':
        return CodeWriter.processSegment(command, segment, index)

      case 'TEMP':
        return CodeWriter.precessTemp(command, segment, index)

      case 'STATIC':
        return CodeWriter.processStatic(command, segment, index)

      case 'POINTER':
        return CodeWriter.processPointer(command, segment, index)
    }
  }

  write(input: Array<allCommands>): string {
    let out = ''

    for (let i = 0; i < input.length; i++) {
      const command = input[i]
      if (isPushPopCommand(command)) {
        const { type, segment, index } = command
        const vms = CodeWriter.writePushPop(type, segment, index)

        vms.forEach((vm) => (out = out + vm + '\n'))
      } else if (isArithmeticCommand(command)) {
        const { type } = command
        const vms = this.writeArithmetic(type)

        vms.forEach((vm) => (out = out + vm + '\n'))
      } else if (isProgramFlowCommand(command)) {
        const { type, label } = command as ParseProgramFlowCommands
        const vms = CodeWriter.processProgramFlow(type, label)

        vms.forEach((vm) => (out = out + vm + '\n'))
      } else if (isFunctionCallCommand(command)) {
        const { type, arg1, arg2 } = command as FunctionCallCommands
        let vms: string[]
        if (arg1) {
          vms = this.processFunction(type, arg1, arg2)
        } else {
          vms = CodeWriter.writeReturn()
        }

        vms.forEach((vm) => (out = out + vm + '\n'))
      }
    }
    return out
  }

  /***
   * Additional functionality from project 8
   */

  static processProgramFlow(type: ProgramFlowType, label: string): string[] {
    switch (type) {
      case 'C_LABEL':
        return CodeWriter.writeLabel(label)
      case 'C_GOTO':
        return CodeWriter.writeGoto(label)
      case 'C_IF-GOTO':
        return CodeWriter.writeIf(label)
    }
  }

  processFunction(type: Omit<FunctionCallType, 'C_RETURN'>, arg1: string, num: number): string[] {
    switch (type) {
      case 'C_FUNCTION':
        return CodeWriter.writeFunction(arg1, num)
      case 'C_CALL':
        console.log(`C_CALL arg1 is ${arg1} num is ${num}`)
        return this.writeCall(arg1, num)
      default:
        return []
    }
  }


  static setFileName(fileName: string) {
    CodeWriter.fileName = fileName
  }

  writeInit() {
    const out: string[] = []
    let outString = ''

    out.push(`@256`, `D=A`, `@SP`, `M=D`)
    out.push(...this.writeCall('Sys.init', 0))

    out.forEach((vm) => (outString = outString + vm + '\n'))
    return outString
  }

  static writeLabel(label: string) {
    const out: string[] = []

    out.push(printCommand('C_LABEL', label, 'N/A'))
    out.push(`(${label})`)

    return out
  }

  static writeGoto(label: string) {
    const out: string[] = []

    out.push(printCommand('C_GOTO', label, 'N/A'))
    out.push(`@${label}`, `0;JMP`)

    return out
  }

  static writeIf(label: string) {
    const out: string[] = []

    out.push(printCommand('C_IF-GOTO', label, 'N/A'))
    out.push(`@SP`, `AM=M-1`, `D=M`)
    out.push(`@${label}`, `D;JNE`)

    return out
  }

  /***
   * function f k: declaring a function f that has k local var
   * declare a label for the function entry
   * k = number of local variables
   * Init all of them to 0
   */
  static writeFunction(functionName: string, numVars: number): string[] {
    const out: string[] = []

    out.push(`(${functionName.toUpperCase()})`)
    for (let i = 0; i < numVars; i++) {
      out.push(...SP_SET_TO_0)
    }

    return out
  }

  /***
   * calling a function f after n arguments have been pushed onto the stack
   */
  writeCall(functionName: string, numArgs: number): string[] {
    const out: string[] = []

    //push return-address
    const returnAddr = `${functionName.toUpperCase()}_RETURN_${this.callIndex++}`
    out.push(`@${returnAddr}`)
    out.push(`D=A`, ...set_SP_pointer_value_equal_to_D, ...SP_increase)

    //push LCL
    out.push(`@LCL`)
    out.push(`D=M`, ...set_SP_pointer_value_equal_to_D, ...SP_increase)

    //push ARG
    out.push(`@ARG`)
    out.push(`D=M`, ...set_SP_pointer_value_equal_to_D, ...SP_increase)

    //push THIS
    out.push(`@THIS`)
    out.push(`D=M`, ...set_SP_pointer_value_equal_to_D, ...SP_increase)

    //push THAT
    out.push(`@THAT`)
    out.push(`D=M`, ...set_SP_pointer_value_equal_to_D, ...SP_increase)

    //ARG=SP-n-5
    out.push(`@${numArgs}`, `D=A`, `@5`, `D=D+A`, `@SP`, `D=M-D`, `@ARG`, `M=D`)

    //LCL=SP
    out.push(`@SP`, `D=M`, `@LCL`, `M=D`)

    //goto f
    out.push(`@${functionName.toUpperCase()}`, `0;JMP`)

    //(return-address)
    out.push(`(${returnAddr})`)

    return out
  }

  static writeReturn() {
    const out: string[] = []

    //FRAME=LCL
    out.push(`@LCL`, `D=M`, `@R13`, `M=D`) // FRAME => R13

    //RET=*(FRAME-5)
    out.push(`@5`, `A=D-A`, `D=M`, `@R14`, `M=D`) // RET = R14

    //*ARG=pop()
    out.push(`@SP`, `AM=M-1`, `D=M`) // store pop() value to D
    out.push(`@ARG`, `A=M`, `M=D`) // store D to *ARG

    //SP=ARG+1
    out.push(`@ARG`, `D=M+1`, `@SP`, `M=D`)

    //THAT=*(FRAME-1)
    out.push(`@R13`, `D=M-1`, `AM=D`, `D=M`, `@THAT`, `M=D`) // THAT => R13

    //THIS=*(FRAME-2)
    out.push(`@R13`, `D=M-1`, `AM=D`, `D=M`, `@THIS`, `M=D`) // THIS => R13

    //ARG=*(FRAME-3)
    out.push(`@R13`, `D=M-1`, `AM=D`, `D=M`, `@ARG`, `M=D`) // ARG => R13

    //LCL=*(FRAME-4)
    out.push(`@R13`, `D=M-1`, `AM=D`, `D=M`, `@LCL`, `M=D`) // LCL=> R13

    //goto RET
    out.push(`@R14`, `A=M`, `0;JMP`)

    return out
  }


}

export default CodeWriter
