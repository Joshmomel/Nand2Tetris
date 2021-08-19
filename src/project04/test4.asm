//Init x and y in stack
@256
D=A
@SP
M=D

@10
D=A
@SP
A=M
M=D

@SP
M=M+1

@20
D=A
@SP
A=M
M=D

@SP
M=M+1

// perform eq 
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M-D //now d=0

@TEMP_EQ
D;JEQ
//Not eqal
@SP
A=M
M=0
@END
0;JMP
(TEMP_EQ)
  @SP
  A=M
  M=1
(END)
  @SP
  M=M+1
  @SP
  A=M
  M=0

