//Init x and y in stack
@256
D=A
@SP
M=D

@11
D=A
@SP
A=M
M=D

@SP
M=M+1

@10
D=A
@SP
A=M
M=D

@SP
M=M+1

// perform eq 
@SP
AM=M-1
D=M
A=A-1
D=M-D
@TEMP // 如果符合条件判断 则跳转到symbol1标记的地址
D;JEQ
@SP
AM=M-1
M=0
@SP
M=M+1
@CONTINUE
0;JMP
(TEMP)
@SP
AM=M-1
M=-1
@SP
M=M+1
(CONTINUE)