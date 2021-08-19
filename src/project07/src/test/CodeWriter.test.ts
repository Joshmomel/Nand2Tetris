import CodeWriter from 'CodeWriter'
import { fileName, printCommand } from 'util/utils'
import { getSegmentBase } from 'util/constants'

jest.mock('util/utils', () => ({
  ...jest.requireActual('util/utils'),
  filePath: 'static/BasicTest.vm',
  fileName: 'BasicTest',
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
        const base = getSegmentBase(segment)

        const out = CodeWriter.writePushPop('C_POP', segment, index)
        const expectOut = []
        expectOut.push(printCommand('C_POP', segment, index))
        expectOut.push(...[`@${base}`, `D=A`, `@${index}`, `D=D+A`, `@addr`, `M=D`])
        expectOut.push(...[`@SP`, `M=M-1`])
        expectOut.push(...[`@SP`, `A=M`, `D=M`, `@addr`, `A=M`, `M=D`])

        expect(out).toEqual(expectOut)
      })

      it('should write `push local` correctly', () => {
        const index = 309
        const segment = 'LOCAL'
        const base = getSegmentBase(segment)
        const out = CodeWriter.writePushPop('C_PUSH', segment, index)
        const expectOut = []

        expectOut.push(printCommand('C_PUSH', 'LOCAL', index))
        expectOut.push(...[`@${base}`, `D=A`, `@${index}`, `D=D+A`, `@addr`, `M=D`])
        expectOut.push(...[`@addr`, `A=M`, `D=M`, `@SP`, `A=M`, `M=D`])
        expectOut.push(...[`@SP`, `M=M+1`])

        expect(out).toEqual(expectOut)
      })
    })

    describe('static', () => {
      it('should write `pop static` correctly', () => {
        const index = 3
        const segment = 'STATIC'

        const out = CodeWriter.writePushPop('C_POP', segment, index)
        const expectOut = []

        expectOut.push(printCommand('C_POP', segment, index))
        expectOut.push(...[`@SP`, `M=M-1`, `@SP`, `A=M`, `D=M`, `@${fileName}.${index}`, `M=D`])

        expect(out).toEqual(expectOut)
      })

      it('should write `push static` correctly', () => {
        const index = 3
        const segment = 'STATIC'

        const out = CodeWriter.writePushPop('C_PUSH', segment, index)
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
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
        'M=M+1',
      ]
      expect(out).toEqual(expectOut)
    })
  })
})
