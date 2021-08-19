export const store_SP_pointer_to_D = [`@SP`, `A=M`, `D=M`]
export const SP_pointer_add_D = [`@SP`, `A=M`, `M=M+D`]
export const SP_pointer_sub_by_D = [`@SP`, `A=M`, `M=M-D`]
export const D_sub_by_M = [`@SP`, `A=M`, `M=M-D`, `D=M`]
export const SP_pointer_neg = [`@SP`, `A=M`, `M=-M`]
export const SP_EQ = (index: number)=>[
  `@TEMP_EQ${index}`,
  `D;JEQ`,
  `@SP`,
  `A=M`,
  `M=0`,
  `@CONTINUE${index}`,
  `0;JMP`,
  `(TEMP_EQ${index})`,
  `@SP`,
  `A=M`,
  `M=-1`,
  `(CONTINUE${index})`,
]
export const SP_GT = (index: number) => [
  `@TEMP_GT${index}`,
  `D;JGT`,
  `@SP`,
  `A=M`,
  `M=0`,
  `@CONTINUE${index}`,
  `0;JMP`,
  `(TEMP_GT${index})`,
  `@SP`,
  `A=M`,
  `M=-1`,
  `(CONTINUE${index})`,
]

export const SP_LT = (index: number) => [
  `@TEMP_LT${index}`,
  `D;JLT`,
  `@SP`,
  `A=M`,
  `M=0`,
  `@CONTINUE${index}`,
  `0;JMP`,
  `(TEMP_LT${index})`,
  `@SP`,
  `A=M`,
  `M=-1`,
  `(CONTINUE${index})`,
]
export const SP_AND_D = [`@SP`, `A=M`, `M=M&D`]
export const SP_OR_D = [`@SP`, `A=M`, `M=M|D`]
export const SP_NOT_D = [`@SP`, `A=M`, `M=!M`]
export const SP_increase = [`@SP`, `M=M+1`]
export const SP_decrease = [`@SP`, `M=M-1`]
