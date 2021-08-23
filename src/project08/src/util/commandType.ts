export type CommandType =
  | 'C_ARITHMETIC'
  | 'C_PUSH'
  | 'C_POP'
  | 'C_LABEL'
  | 'C_GOTO'
  | 'C_IF-GOTO'
  | 'C_FUNCTION'
  | 'C_RETURN'
  | 'C_CALL'

export type PushPopType = 'C_PUSH' | 'C_POP'

export type ArithmeticType = 'ADD' | 'SUB' | 'NEG' | 'EQ' | 'GT' | 'LT' | 'AND' | 'OR' | 'NOT'

export type ProgramFlowType = 'C_LABEL' | 'C_GOTO' | 'C_IF-GOTO'

export type FunctionCallType = 'C_CALL' | 'C_FUNCTION' | 'C_RETURN'

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

export interface ParseProgramFlowCommands {
  type: ProgramFlowType
  label: string
}

export interface FunctionCallCommands {
  type: FunctionCallType,
  arg1: string
  arg2: number
}

export type allCommands =
  ParsePushPopCommands
  | ParseArithmeticCommands
  | ParseProgramFlowCommands
  | FunctionCallCommands

export function isPushPopCommand(command: allCommands): command is ParsePushPopCommands {
  return (command as ParsePushPopCommands).index !== undefined
}

//'ADD' | 'SUB' | 'NEG' | 'EQ' | 'GT' | 'LT' | 'AND' | 'OR' | 'NOT'
export function isArithmeticCommand(command: allCommands): command is ParseArithmeticCommands {
  return (command as ParseArithmeticCommands).type === 'ADD' ||
    (command as ParseArithmeticCommands).type === 'SUB' ||
    (command as ParseArithmeticCommands).type === 'NEG' ||
    (command as ParseArithmeticCommands).type === 'EQ' ||
    (command as ParseArithmeticCommands).type === 'GT' ||
    (command as ParseArithmeticCommands).type === 'LT' ||
    (command as ParseArithmeticCommands).type === 'AND' ||
    (command as ParseArithmeticCommands).type === 'OR' ||
    (command as ParseArithmeticCommands).type === 'NOT'

}

export function isProgramFlowCommand(command: allCommands): command is ParseProgramFlowCommands {
  return (command as ParseProgramFlowCommands).type === 'C_LABEL' ||
    (command as ParseProgramFlowCommands).type === 'C_GOTO' ||
    (command as ParseProgramFlowCommands).type === 'C_IF-GOTO'
}

export function isFunctionCallCommand(command: allCommands): command is FunctionCallCommands {
  return (command as FunctionCallCommands).type === 'C_CALL' ||
    (command as FunctionCallCommands).type === 'C_FUNCTION' ||
    (command as FunctionCallCommands).type === 'C_RETURN'
}
