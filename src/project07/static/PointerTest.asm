// command:C_PUSH : segment: CONSTANT : index: 3030
@3030
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_POP : segment: POINTER : index: 0
@THIS
D=A
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// command:C_PUSH : segment: CONSTANT : index: 3040
@3040
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_POP : segment: POINTER : index: 1
@THAT
D=A
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// command:C_PUSH : segment: CONSTANT : index: 32
@32
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_POP : segment: THIS : index: 2
@3000
D=A
@2
D=D+A
@addr
M=D
@SP
M=M-1
@SP
A=M
D=M
@addr
A=M
M=D
// command:C_PUSH : segment: CONSTANT : index: 46
@46
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_POP : segment: THAT : index: 6
@3010
D=A
@6
D=D+A
@addr
M=D
@SP
M=M-1
@SP
A=M
D=M
@addr
A=M
M=D
// command:C_PUSH : segment: POINTER : index: 0
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: POINTER : index: 1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// command:ADD : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M+D
@SP
M=M+1
// command:C_PUSH : segment: THIS : index: 2
@3000
D=A
@2
D=D+A
@addr
M=D
@addr
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
// command:SUB : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M-D
@SP
M=M+1
// command:C_PUSH : segment: THAT : index: 6
@3010
D=A
@6
D=D+A
@addr
M=D
@addr
A=M
D=M
@SP
A=M
M=D
@SP
M=M+1
// command:ADD : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M+D
@SP
M=M+1
