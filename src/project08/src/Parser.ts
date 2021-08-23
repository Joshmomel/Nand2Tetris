import {
  allCommands,
  ArithmeticType, CommandType, FunctionCallType,
  ProgramFlowType,
  PushPopType,
  Segment
} from 'util/commandType'
import { arithmetic, functionCall, programFlow, pushpop } from './util/constants'

export const test = (num: number) => {
  return num + 1
}

/***
 * 1. Handles the parsing of a single .vm file
 * 2. Reads a VM command, parses the command into its lexical components,
 *    and provides convenient access to these components
 * 3. Ignores all white space and comments
 */
export class Parser {
  constructor(public input: string) {
    this.input = input
  }

  parse() {
    const lines = this.input.split(/\r?\n/)
    const out: Array<allCommands> = []

    for (const line of lines) {
      const commands = line.split(' ')
      let commandType: CommandType
      let arg1, arg2
      if (arithmetic.includes(commands[0])) {
        const arithmeticType = commands[0].toUpperCase() as ArithmeticType

        out.push({ type: arithmeticType })
      } else if (pushpop.includes(commands[0])) {
        commandType = `C_${commands[0].toUpperCase()}` as PushPopType
        arg1 = commands[1].toUpperCase() as Segment
        // @ts-ignore
        const index = commands[2].match(/\d+/)[0]
        arg2 = Number(index)

        out.push({ type: commandType, segment: arg1, index: arg2 })
      } else if (programFlow.includes(commands[0])) {
        commandType = `C_${commands[0].toUpperCase()}` as ProgramFlowType
        arg1 = commands[1].toUpperCase()

        out.push({ type: commandType, label: arg1 })
      } else if (functionCall.includes(commands[0])) {
        commandType = `C_${commands[0].toUpperCase()}` as FunctionCallType
        arg1 = commands[1]
        arg2 = Number(commands[2])

        out.push({ type: commandType, arg1, arg2 })
      }
    }
    return out
  }
}
