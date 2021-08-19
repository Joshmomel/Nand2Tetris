import {
  ArithmeticType,
  isPushPopCommand,
  ParseArithmeticCommands,
  ParsePushPopCommands,
  PushPopType,
  Segment,
} from './util/commandType'
import { fileName, printCommand } from './util/utils'
import { getSegmentBase } from './util/constants'
import {
  D_sub_by_M,
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
  SP_pointer_sub_by_D,
  store_SP_pointer_to_D,
} from './util/commonVMCodes'

class CodeWriter {
  index = 0

  constructor() {
    this.index = 0
  }

  static arithmeticCode = (index: number) => ({
    ADD: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...SP_pointer_add_D,
      ...SP_increase,
    ],
    SUB: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...SP_pointer_sub_by_D,
      ...SP_increase,
    ],
    NEG: [...SP_decrease, ...SP_pointer_neg, ...SP_increase],
    EQ: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_EQ(index),
      ...SP_increase,
    ],
    GT: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_GT(index),
      ...SP_increase,
    ],
    LT: [
      ...SP_decrease,
      ...store_SP_pointer_to_D,
      ...SP_decrease,
      ...D_sub_by_M,
      ...SP_LT(index),
      ...SP_increase,
    ],
    AND: [...SP_decrease, ...store_SP_pointer_to_D, ...SP_decrease, ...SP_AND_D, ...SP_increase],
    OR: [...SP_decrease, ...store_SP_pointer_to_D, ...SP_decrease, ...SP_OR_D, ...SP_increase],
    NOT: [...SP_decrease, ...SP_NOT_D, ...SP_increase],
  })

  private static processConstant(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    out.push(printCommand(command, segment, index))
    out.push(...[`@${index}`, 'D=A', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1'])

    return out
  }

  private static processSegment(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    const base = getSegmentBase(segment)
    out.push(printCommand(command, segment, index))

    if (command === 'C_POP') {
      //addr = LCL+i
      out.push(...[`@${base}`, `D=A`, `@${index}`, `D=D+A`, `@addr`, `M=D`])
      //SP--
      out.push(...[`@SP`, `M=M-1`])
      // *addr = *SP
      out.push(...[`@SP`, `A=M`, `D=M`, `@addr`, `A=M`, `M=D`])
    } else if (command === 'C_PUSH') {
      //addr = LCL+i
      out.push(...[`@${base}`, `D=A`, `@${index}`, `D=D+A`, `@addr`, `M=D`])
      //*SP = *addr
      out.push(...[`@addr`, `A=M`, `D=M`, `@SP`, `A=M`, `M=D`])
      //SP++
      out.push(...[`@SP`, `M=M+1`])
    }

    // console.log('processLocal function out is', out)
    return out
  }

  private static processStatic(command: PushPopType, segment: Segment, index: number) {
    const out: string[] = []
    out.push(printCommand(command, segment, index))

    if (command === 'C_POP') {
      out.push(...[`@SP`, `M=M-1`, `@SP`, `A=M`, `D=M`, `@${fileName}.${index}`, `M=D`])
    } else if (command === 'C_PUSH') {
      out.push(...[`@${fileName}.${index}`, `D=M`, `@SP`, `A=M`, `M=D`, `@SP`, `M=M+1`])
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
      case 'TEMP':
        return CodeWriter.processSegment(command, segment, index)

      case 'STATIC':
        return CodeWriter.processStatic(command, segment, index)

      case 'POINTER':
        return CodeWriter.processPointer(command, segment, index)

      default:
        throw new Error('No patch segment')
    }
  }

  write(input: Array<ParsePushPopCommands | ParseArithmeticCommands>): string {
    let out = ''

    for (let i = 0; i < input.length; i++) {
      const command = input[i]
      if (isPushPopCommand(command)) {
        const { type, segment, index } = command
        const vms = CodeWriter.writePushPop(type, segment, index)

        vms.forEach((vm) => (out = out + vm + '\n'))
      } else {
        const { type } = command
        const vms = this.writeArithmetic(type)

        vms.forEach((vm) => (out = out + vm + '\n'))
      }
    }
    return out
  }
}

export default CodeWriter
