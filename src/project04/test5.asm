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
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M-D

@TEMP_EQ
D;JEQ
//Not eqal
@SP
A=M
M=0
(TEMP_EQ)
  @SP
  A=M
  M=-1

@SP
M=M+1


