//Set sp to 256
@256
D=A
@SP
M=D

// SP = SP -1
@SP
M=M-1

//*SP = 10
@10
D=A
@SP
A=M
M=D

//addr=5
@5
D=A
@addr
M=D

//*addr = *SP
@SP
A=M
D=M
@addr
A=M
M=D

//SP--
@SP
M=M-1

//*SP = *addr
@addr
A=M
D=M
@SP
A=M
M=D





