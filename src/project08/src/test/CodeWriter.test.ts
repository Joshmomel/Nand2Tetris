import CodeWriter from 'CodeWriter'
import { printCommand } from 'util/utils'
import { SP_decrease, SP_increase, store_SP_pointer_to_D } from '../util/commonVMCodes'

jest.mock('util/utils', () => ({
  ...jest.requireActual('util/utils'),
  filePath: 'static/BasicTest.vm',
  fileName: 'BasicTest'
}))

describe('CodeWriter', () => {
  describe('writePushPop()', () => {
    describe('constant', () => {
      it('should write `push constant` correctly', () => {
        const out = CodeWriter.writePushPop('C_PUSH', 'CONSTANT', 10)
        const expectOut = []

        expectOut.push(printCommand('C_PUSH', 'CONSTANT', 10))
        expectOut.push(...['@10', 'D=A', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1'])

        expect(out).toEqual(expectOut)
      })
    })

    describe('local', () => {
      it('should write `pop local` correctly', () => {
        const index = 309
        const segment = 'LOCAL'

        const out = CodeWriter.writePushPop('C_POP', segment, index)
        const expectOut = []
        expectOut.push(printCommand('C_POP', segment, index))
        const addr = [`@LCL`, `D=A`, `@${index}`, `D=M+D`, `@addr`, `M=D`]
        expectOut.push(...addr, ...SP_decrease, ...store_SP_pointer_to_D, `@addr`, `A=M`, `M=D`)
        expect(out).toEqual(expectOut)
      })

      it('should write `push local` correctly', () => {
        const index = 309
        const segment = 'LOCAL'
        const out = CodeWriter.writePushPop('C_PUSH', segment, index)
        const expectOut = []

        expectOut.push(printCommand('C_PUSH', 'LOCAL', index))
        const addr = [`@LCL`, `D=M`, `@${index}`, `A=D+A`]
        expectOut.push(...addr, `D=M`, `@SP`, `A=M`, `M=D`, ...SP_increase)

        expect(out).toEqual(expectOut)
      })
    })

    describe('static', () => {
      it('should write `pop static` correctly', () => {
        const index = 3
        const segment = 'STATIC'
        const fileName = ''

        const out = CodeWriter.writePushPop('C_POP', segment, index)
        CodeWriter.setFileName(fileName)
        const expectOut = []

        expectOut.push(printCommand('C_POP', segment, index))
        expectOut.push(...[`@SP`, `M=M-1`, `@SP`, `A=M`, `D=M`, `@${fileName}.${index}`, `M=D`])

        expect(out).toEqual(expectOut)
      })

      it('should write `push static` correctly', () => {
        const index = 3
        const segment = 'STATIC'
        const fileName = ''

        const out = CodeWriter.writePushPop('C_PUSH', segment, index)
        CodeWriter.setFileName(fileName)
        const expectOut = []

        expectOut.push(printCommand('C_PUSH', segment, index))
        expectOut.push(...[`@${fileName}.${index}`, `D=M`, `@SP`, `A=M`, `M=D`, `@SP`, `M=M+1`])

        expect(out).toEqual(expectOut)
      })
    })

    describe('pointer', () => {
      it('should write `pop pointer` correctly', () => {
        const index = 5
        const segment = 'POINTER'

        const out = CodeWriter.writePushPop('C_POP', segment, index)
        const expectOut = []

        expectOut.push(printCommand('C_POP', segment, index))
        expectOut.push(
          ...['@THAT', 'D=A', '@R13', 'M=D', '@SP', 'AM=M-1', 'D=M', '@R13', 'A=M', 'M=D']
        )

        expect(out).toEqual(expectOut)
      })

      it('should write `push pointer` correctly', () => {
        const index = 5
        const segment = 'POINTER'

        const out = CodeWriter.writePushPop('C_PUSH', segment, index)
        const expectOut = []

        expectOut.push(printCommand('C_PUSH', segment, index))
        expectOut.push(...[`@THAT`, `D=M`, `@SP`, `A=M`, `M=D`, `@SP`, `M=M+1`])

        expect(out).toEqual(expectOut)
      })
    })
  })

  describe('writeArithmetic()', () => {
    it('should write `ADD` correctly ', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('ADD')
      const expectOut = [
        '// command:ADD : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M+D',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('should write `SUB` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('SUB')
      const expectOut = [
        '// command:SUB : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M-D',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('should write `NEG` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('NEG')
      const expectOut = []
      expectOut.push(printCommand('NEG', 'N/A', 'n/A'))
      expectOut.push(...['@SP', 'M=M-1', '@SP', 'A=M', 'M=-M', '@SP', 'M=M+1'])
      expect(out).toEqual(expectOut)
    })

    it('should write `EQ` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('EQ')
      const expectOut = [
        '// command:EQ : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M-D',
        'D=M',
        '@TEMP_EQ0',
        'D;JEQ',
        '@SP',
        'A=M',
        'M=0',
        '@CONTINUE0',
        '0;JMP',
        '(TEMP_EQ0)',
        '@SP',
        'A=M',
        'M=-1',
        '(CONTINUE0)',
        '@SP',
        'M=M+1'
      ]
      expect(expectOut).toEqual(out)
    })

    it('should write `GT` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('GT')
      const expectOut = [
        '// command:GT : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M-D',
        'D=M',
        '@TEMP_GT0',
        'D;JGT',
        '@SP',
        'A=M',
        'M=0',
        '@CONTINUE0',
        '0;JMP',
        '(TEMP_GT0)',
        '@SP',
        'A=M',
        'M=-1',
        '(CONTINUE0)',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })
    it('should write `LT` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('LT')
      const expectOut = [
        '// command:LT : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M-D',
        'D=M',
        '@TEMP_LT0',
        'D;JLT',
        '@SP',
        'A=M',
        'M=0',
        '@CONTINUE0',
        '0;JMP',
        '(TEMP_LT0)',
        '@SP',
        'A=M',
        'M=-1',
        '(CONTINUE0)',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('should write `AND` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('AND')
      const expectOut = [
        '// command:AND : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M&D',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('should write `OR` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('OR')
      const expectOut = [
        '// command:OR : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=M|D',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('should write `NOT` correctly', () => {
      const codeWriter = new CodeWriter()
      const out = codeWriter.writeArithmetic('NOT')
      const expectOut = [
        '// command:NOT : segment: N/A : index: n/A',
        '@SP',
        'M=M-1',
        '@SP',
        'A=M',
        'M=!M',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })
  })

  describe('program flow', () => {
    it('writeLabel generates correct asm code ', () => {
      const out = CodeWriter.writeLabel('LOOP_START')

      expect(out).toEqual([printCommand('C_LABEL', 'LOOP_START', 'N/A'), ...['(LOOP_START)']])
    })

    it('writeGoto generates correct asm code ', () => {
      const out = CodeWriter.writeGoto('LOOP_START')
      expect(out).toEqual([printCommand('C_GOTO', 'LOOP_START', 'N/A'), ...['@LOOP_START', `0;JMP`]])
    })

    it('writeIf generates correct asm code ', () => {
      const out = CodeWriter.writeIf('LOOP_START')
      expect(out).toEqual([printCommand('C_IF-GOTO', 'LOOP_START', 'N/A'), ...[`@SP`, `AM=M-1`, `D=M`, `@LOOP_START`, `D;JNE`]])
    })

  })

  describe('function', () => {
    it('writeFunction generates correct asm code', () => {
      const out = CodeWriter.writeFunction('SimpleFunction.test', 2)
      const expectOut =  [
        '(SIMPLEFUNCTION.TEST)',
        '@0',
        'D=A',
        '@SP',
        'A=M',
        'M=D',
        '@SP',
        'M=M+1',
        '@0',
        'D=A',
        '@SP',
        'A=M',
        'M=D',
        '@SP',
        'M=M+1'
      ]
      expect(out).toEqual(expectOut)
    })

    it('writeCall generates correct asm code', () => {
      const out = CodeWriter.writeReturn()
      const expectOut = [
        '@LCL',   'D=M',   '@R13',  'M=D',   '@5',
        'A=D-A',  'D=M',   '@R14',  'M=D',   '@SP',
        'AM=M-1', 'D=M',   '@ARG',  'A=M',   'M=D',
        '@ARG',   'D=M+1', '@SP',   'M=D',   '@R13',
        'D=M-1',  'AM=D',  'D=M',   '@THAT', 'M=D',
        '@R13',   'D=M-1', 'AM=D',  'D=M',   '@THIS',
        'M=D',    '@R13',  'D=M-1', 'AM=D',  'D=M',
        '@ARG',   'M=D',   '@R13',  'D=M-1', 'AM=D',
        'D=M',    '@LCL',  'M=D',   '@R14',  'A=M',
        '0;JMP'
      ]
      expect(out).toEqual(expectOut)
    })
  })
})
