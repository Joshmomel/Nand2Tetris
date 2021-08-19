export type CommandType =
  | 'C_ARITHMETIC'
  | 'C_PUSH'
  | 'C_POP'
  | 'C_LABEL'
  | 'C_GOTO'
  | 'C_IF'
  | 'C_FUNCTION'
  | 'C_RETURN'
  | 'C_CALL'

export type PushPopType = 'C_PUSH' | 'C_POP'

export type ArithmeticType = 'ADD' | 'SUB' | 'NEG' | 'EQ' | 'GT' | 'LT' | 'AND' | 'OR' | 'NOT'

export type Segment =
  | 'LOCAL'
  | 'ARGUMENT'
  | 'THIS'
  | 'THAT'
  | 'CONSTANT'
  | 'STATIC'
  | 'POINTER'
  | 'TEMP'

export interface ParsePushPopCommands {
  type: PushPopType
  segment: Segment
  index: number
}

export interface ParseArithmeticCommands {
  type: ArithmeticType
}


export function isPushPopCommand(command: ParsePushPopCommands | ParseArithmeticCommands): command is ParsePushPopCommands {
  return (command as ParsePushPopCommands).index !== undefined
}
