// command:C_PUSH : segment: CONSTANT : index: 7
@7
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 8
@8
D=A
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
