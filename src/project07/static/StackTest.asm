// command:C_PUSH : segment: CONSTANT : index: 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:EQ : segment: N/A : index: n/A
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
D=M
@TEMP_EQ0
D;JEQ
@SP
A=M
M=0
@CONTINUE0
0;JMP
(TEMP_EQ0)
@SP
A=M
M=-1
(CONTINUE0)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:EQ : segment: N/A : index: n/A
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
D=M
@TEMP_EQ1
D;JEQ
@SP
A=M
M=0
@CONTINUE1
0;JMP
(TEMP_EQ1)
@SP
A=M
M=-1
(CONTINUE1)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:EQ : segment: N/A : index: n/A
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
D=M
@TEMP_EQ2
D;JEQ
@SP
A=M
M=0
@CONTINUE2
0;JMP
(TEMP_EQ2)
@SP
A=M
M=-1
(CONTINUE2)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:LT : segment: N/A : index: n/A
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
D=M
@TEMP_LT3
D;JLT
@SP
A=M
M=0
@CONTINUE3
0;JMP
(TEMP_LT3)
@SP
A=M
M=-1
(CONTINUE3)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:LT : segment: N/A : index: n/A
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
D=M
@TEMP_LT4
D;JLT
@SP
A=M
M=0
@CONTINUE4
0;JMP
(TEMP_LT4)
@SP
A=M
M=-1
(CONTINUE4)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:LT : segment: N/A : index: n/A
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
D=M
@TEMP_LT5
D;JLT
@SP
A=M
M=0
@CONTINUE5
0;JMP
(TEMP_LT5)
@SP
A=M
M=-1
(CONTINUE5)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:GT : segment: N/A : index: n/A
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
D=M
@TEMP_GT6
D;JGT
@SP
A=M
M=0
@CONTINUE6
0;JMP
(TEMP_GT6)
@SP
A=M
M=-1
(CONTINUE6)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:GT : segment: N/A : index: n/A
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
D=M
@TEMP_GT7
D;JGT
@SP
A=M
M=0
@CONTINUE7
0;JMP
(TEMP_GT7)
@SP
A=M
M=-1
(CONTINUE7)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:GT : segment: N/A : index: n/A
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
D=M
@TEMP_GT8
D;JGT
@SP
A=M
M=0
@CONTINUE8
0;JMP
(TEMP_GT8)
@SP
A=M
M=-1
(CONTINUE8)
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 53
@53
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
// command:C_PUSH : segment: CONSTANT : index: 112
@112
D=A
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
// command:NEG : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
M=-M
@SP
M=M+1
// command:AND : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M&D
@SP
M=M+1
// command:C_PUSH : segment: CONSTANT : index: 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1
// command:OR : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M|D
@SP
M=M+1
// command:NOT : segment: N/A : index: n/A
@SP
M=M-1
@SP
A=M
M=!M
@SP
M=M+1