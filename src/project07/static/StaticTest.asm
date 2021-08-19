// command:C_PUSH : segment: CONSTANT : index: 111
@111
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 333
@333
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 888
@888
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_POP : segment: STATIC : index: 8
@SP
M=M-1
@SP
A=M
D=M
@StaticTest.8
M=D
// command:C_POP : segment: STATIC : index: 3
@SP
M=M-1
@SP
A=M
D=M
@StaticTest.3
M=D
// command:C_POP : segment: STATIC : index: 1
@SP
M=M-1
@SP
A=M
D=M
@StaticTest.1
M=D
// command:C_PUSH : segment: STATIC : index: 3
@StaticTest.3
D=M
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: STATIC : index: 1
@StaticTest.1
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
// command:C_PUSH : segment: STATIC : index: 8
@StaticTest.8
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
