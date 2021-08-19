import {
  ArithmeticType,
  ParseArithmeticCommands,
  ParsePushPopCommands,
  PushPopType,
  Segment,
} from 'util/commandType'
import { arithmetic, pushpop } from './util/constants'

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
    const out: Array<ParsePushPopCommands | ParseArithmeticCommands> = []

    for (const line of lines) {
      const commands = line.split(' ')
      let commandType: ArithmeticType | PushPopType
      let arg1, arg2
      if (arithmetic.includes(commands[0])) {
        const arithmeticType = commands[0].toUpperCase() as ArithmeticType

        out.push({ type: arithmeticType })
      } else if (pushpop.includes(commands[0])) {
        commandType = `C_${commands[0].toUpperCase()}` as PushPopType
        arg1 = commands[1].toUpperCase() as Segment
        arg2 = Number(commands[2])

        out.push({ type: commandType, segment: arg1, index: arg2 })
      }
    }
    return out
  }
}
