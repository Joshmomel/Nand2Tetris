import Token from './Token'
import { arrayToGenerator } from './utils/arrayToChar'
import PeekIterator from './utils/PeekIterator'
import ASTNode from './ASTNode'
import { isKeywordConstant, isOp, isUnaryOp } from './utils/utils'

class CompilationEngine {
  constructor() {}

  static analyse(tokens: Token[]) {
    let p
    const it = new PeekIterator(arrayToGenerator(tokens)) as PeekIterator<Token>
    while (it.hasNext()) {
      const token = it.next()
      if (token && token.value === 'class') {
        it.putBack()
        p = CompilationEngine.compileClass(it)
      }
    }
    return p
  }

  static compileClass(it: PeekIterator<Token>) {
    let token: Token

    token = it.next()!
    // parent: <class>
    const parent = new ASTNode('program', 'class')
    parent.addChild(new ASTNode(token.type, token.value))
    // print(token)

    token = it.next() as Token
    parent.addChild(new ASTNode(token.type, token.value))
    // print(token)

    // children: <symbol> { </symbol>
    token = it.next() as Token
    parent.addChild(new ASTNode(token.type, token.value))
    // print(token)

    while (it.hasNext()) {
      const token = it.next() as Token

      switch (token.value) {
        case '}':
          parent.addChild(new ASTNode(token.type, token.value))
          break
        case 'static':
        case 'field':
          let classVarDec = null
          it.putBack()
          if ((classVarDec = CompilationEngine.compileClassVarDec(it)) !== null) {
            parent.addChild(classVarDec)
          }
          break
        case 'constructor':
        case 'function':
        case 'method':
          let compileSubroutineDec = null
          it.putBack()
          if ((compileSubroutineDec = CompilationEngine.compileSubroutineDec(it)) !== null) {
            parent.addChild(compileSubroutineDec)
          }
          break
      }
    }

    return parent
  }

  static compileClassVarDec(it: PeekIterator<Token>) {
    // <keyword> static/field </keyword>
    const token = it.next()!
    const classVarDec = new ASTNode('program', 'classVarDec')
    classVarDec.addChild(new ASTNode(token.type, token.value))

    while (it.hasNext()) {
      const token = it.next() as Token
      classVarDec.addChild(new ASTNode(token.type, token.value))
      if (token.value === ';') break
    }

    return classVarDec
  }

  static compileSubroutineDec(it: PeekIterator<Token>) {
    const token = it.next()!
    const classVarDec = new ASTNode('program', 'subroutineDec')
    classVarDec.addChild(new ASTNode(token.type, token.value))

    if (it.hasNext()) {
      let token
      token = it.next()!

      //(constructor | function | method)
      if (token.value === 'constructor' || token.value === 'function' || token.value === 'method') {
        classVarDec.addChild(new ASTNode(token.type, token.value))
        token = it.next()!
      }

      //type
      classVarDec.addChild(new ASTNode(token.type, token.value))
      token = it.next()!

      //subroutineName
      classVarDec.addChild(new ASTNode(token.type, token.value))
      token = it.next()!

      //parameterList
      if (token.value === '(') {
        classVarDec.addChild(new ASTNode(token.type, token.value))
        const parameterListNodes = CompilationEngine.compileParameterList(it)

        classVarDec.addChild(parameterListNodes)
        const closeBracket = it.next()!

        classVarDec.addChild(new ASTNode(closeBracket.type, closeBracket.value))
        token = it.next()!
      }

      //subroutineBody
      if (token.value === '{') {
        it.putBack()
        const subroutineBodyNode = CompilationEngine.compileSubroutineBody(it)
        classVarDec.addChild(subroutineBodyNode)
      }
    }

    return classVarDec
  }

  static compileParameterList(it: PeekIterator<Token>) {
    const parameterList = new ASTNode('program', 'parameterList')

    while (it.hasNext()) {
      const token = it.next()
      if (token == null) break
      if (token.value === ')') {
        it.putBack()
        break
      }
      parameterList.addChild(new ASTNode(token.type, token.value))
    }

    return parameterList
  }

  static compileSubroutineBody(it: PeekIterator<Token>) {
    const token = it.next()!
    const subroutineBody = new ASTNode('program', 'subroutineBody')
    subroutineBody.addChild(new ASTNode(token.type, token.value))

    while (it.hasNext()) {
      const token = it.next()

      if (token === null) break

      if (token.value === '}') {
        subroutineBody.addChild(new ASTNode(token.type, token.value))
        break
      }

      if (token.value === 'var') {
        it.putBack()
        const varDec = CompilationEngine.compileVarDec(it)
        subroutineBody.addChild(varDec)
      } else {
        it.putBack()
        const statement = CompilationEngine.compileStatements(it)
        subroutineBody.addChild(statement)
      }
    }

    return subroutineBody
  }

  static compileVarDec(it: PeekIterator<Token>) {
    const token = it.next()!
    const varDec = new ASTNode('program', 'varDec')
    varDec.addChild(new ASTNode(token.type, token.value))

    while (it.hasNext()) {
      const token = it.next()

      if (token === null) break

      if (token.value === ';') {
        varDec.addChild(new ASTNode(token.type, token.value))
        break
      }

      varDec.addChild(new ASTNode(token.type, token.value))
    }

    return varDec
  }

  static compileStatements(it: PeekIterator<Token>) {
    const statements = new ASTNode('program', 'statements')

    while (it.hasNext()) {
      const token = it.next()

      if (token === null) break

      if (token.value === '}') {
        it.putBack()
        break
      }

      if (token.value === 'let') {
        it.putBack()
        const letStatement = CompilationEngine.compileLet(it)
        statements.addChild(letStatement)
      } else if (token.value === 'if') {
        it.putBack()
        const ifStatement = CompilationEngine.compileIf(it)
        statements.addChild(ifStatement)
      } else if (token.value === 'while') {
        it.putBack()
        const whileStatement = CompilationEngine.compileWhile(it)
        statements.addChild(whileStatement)
      } else if (token.value === 'do') {
        it.putBack()
        const doStatement = CompilationEngine.compileDo(it)
        statements.addChild(doStatement)
      } else if (token.value === 'return') {
        it.putBack()
        const returnStatement = CompilationEngine.compileReturn(it)
        statements.addChild(returnStatement)
      }
    }

    return statements
  }

  static compileLet(it: PeekIterator<Token>) {
    const token = it.next()!
    const letStatement = new ASTNode('program', 'letStatement')

    // let
    letStatement.addChild(new ASTNode(token.type, token.value))

    if (it.hasNext()) {
      let token
      let lookahead
      //varName
      token = it.next()!
      letStatement.addChild(new ASTNode(token.type, token.value))

      lookahead = it.peek()
      if (lookahead && lookahead.value === '[') {
        // [
        let token = it.next()!
        letStatement.addChild(new ASTNode(token.type, token.value))

        const expression = CompilationEngine.compileExpression(it)
        letStatement.addChild(expression)

        // ]
        token = it.next()!
        letStatement.addChild(new ASTNode(token.type, token.value))
      }

      lookahead = it.peek()
      if (lookahead && lookahead.value === '=') {
        token = it.next()!
        letStatement.addChild(new ASTNode(token.type, token.value))
        const expression = CompilationEngine.compileExpression(it)
        letStatement.addChild(expression)
      }

      token = it.next()
      if (token && token.value === ';') {
        letStatement.addChild(new ASTNode(token.type, token.value))
      }
    }

    return letStatement
  }

  static compileIf(it: PeekIterator<Token>) {
    let token = it.next()!
    const ifStatement = new ASTNode('program', 'ifStatement')
    ifStatement.addChild(new ASTNode(token.type, token.value))

    // (
    token = it.next()!
    ifStatement.addChild(new ASTNode(token.type, token.value))

    const expression = CompilationEngine.compileExpression(it)
    ifStatement.addChild(expression)

    //)
    token = it.next()!
    ifStatement.addChild(new ASTNode(token.type, token.value))

    let lookahead = it.peek()
    if (lookahead && lookahead.value === '{') {
      //{
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      const statements = CompilationEngine.compileStatements(it)
      ifStatement.addChild(statements)

      //}
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))
    }

    lookahead = it.peek()
    console.log('lookahead is', lookahead)
    while (lookahead && lookahead.value === 'else') {
      // else
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      //{
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      const statements = CompilationEngine.compileStatements(it)
      ifStatement.addChild(statements)

      //}
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      lookahead = it.peek()
      console.log('lookahead inside is', lookahead)
    }

    return ifStatement
  }

  static compileWhile(it: PeekIterator<Token>) {
    let token = it.next()!
    const whileStatement = new ASTNode('program', 'whileStatement')
    whileStatement.addChild(new ASTNode(token.type, token.value))

    // (
    token = it.next()!
    whileStatement.addChild(new ASTNode(token.type, token.value))

    const expression = CompilationEngine.compileExpression(it)
    whileStatement.addChild(expression)

    //)
    token = it.next()!
    whileStatement.addChild(new ASTNode(token.type, token.value))

    const lookahead = it.peek()
    if (lookahead && lookahead.value === '{') {
      //{
      token = it.next()!
      whileStatement.addChild(new ASTNode(token.type, token.value))

      const statements = CompilationEngine.compileStatements(it)
      whileStatement.addChild(statements)

      //}
      token = it.next()!
      whileStatement.addChild(new ASTNode(token.type, token.value))
    }

    return whileStatement
  }

  static compileDo(it: PeekIterator<Token>) {
    const token = it.next()!
    const doStatement = new ASTNode('program', 'doStatement')
    doStatement.addChild(new ASTNode(token.type, token.value))

    CompilationEngine.compileSubroutineCall(it, doStatement)
    if (it.hasNext() && it.peek()!.value === ';') {
      const token = it.next()!
      doStatement.addChild(new ASTNode(token.type, token.value))
    }

    return doStatement
  }

  static compileReturn(it: PeekIterator<Token>) {
    let token = it.next()!
    const returnStatement = new ASTNode('program', 'returnStatement')
    //return
    returnStatement.addChild(new ASTNode(token.type, token.value))

    if (it.hasNext() && it.peek()!.value !== ';') {
      const expression = CompilationEngine.compileExpression(it)
      returnStatement.addChild(expression)
    }

    //;
    token = it.next()!
    returnStatement.addChild(new ASTNode(token.type, token.value))

    return returnStatement
  }

  static compileExpression(it: PeekIterator<Token>) {
    const expression = new ASTNode('program', 'expression')

    // term
    const term = CompilationEngine.compileTerm(it)
    expression.addChild(term)

    const lookahead = it.peek()
    if (lookahead && isOp(lookahead)) {
      // op
      const token = it.next()!
      expression.addChild(new ASTNode(token.type, token.value))

      // term
      const term = CompilationEngine.compileTerm(it)
      expression.addChild(term)
    }

    return expression
  }

  static compileTerm(it: PeekIterator<Token>) {
    let token = it.next()!
    const term = new ASTNode('program', 'term')

    if (token.type === 'identifier') {
      const identifierNode = new ASTNode(token.type, token.value)

      const lookahead = it.peek()
      if (lookahead && lookahead.value === '[') {
        // identifier
        term.addChild(identifierNode)

        // [
        let token = it.next()!
        term.addChild(new ASTNode(token.type, token.value))

        //expression
        const expression = CompilationEngine.compileExpression(it)
        term.addChild(expression)

        // ]
        token = it.next()!
        term.addChild(new ASTNode(token.type, token.value))
      } else if (lookahead && (lookahead.value === '(' || lookahead.value === '.')) {
        it.putBack()
        CompilationEngine.compileSubroutineCall(it, term)
      } else {
        // only identifier
        term.addChild(identifierNode)
      }
    } else if (token.type === 'integerConstant') {
      term.addChild(new ASTNode(token.type, token.value))
    } else if (token.type === 'stringConstant') {
      term.addChild(new ASTNode(token.type, token.value))
    } else if (token.value === '(') {
      // (
      term.addChild(new ASTNode(token.type, token.value))

      //expression
      const expression = CompilationEngine.compileExpression(it)
      term.addChild(expression)

      // )
      token = it.next()!
      term.addChild(new ASTNode(token.type, token.value))
    } else if (isKeywordConstant(token)) {
      term.addChild(new ASTNode(token.type, token.value))
    } else if (isUnaryOp(token)) {
      term.addChild(new ASTNode(token.type, token.value))
      const newTerm = CompilationEngine.compileTerm(it)
      term.addChild(newTerm)
    } else {
      //Error
      console.log('----- compileTerm error', token)
    }

    return term
  }

  static compileExpressionList(it: PeekIterator<Token>) {
    const expressionListStatement = new ASTNode('program', 'expressionList')

    while (it.peek() && it.peek()!.value !== ')') {
      const token = it.next()!

      if (token.value === ';') break

      if (token.value !== ',') {
        // expression
        it.putBack()
        const expression = CompilationEngine.compileExpression(it)
        expressionListStatement.addChild(expression)
      } else {
        // ,
        expressionListStatement.addChild(new ASTNode(token.type, token.value))
      }
    }

    return expressionListStatement
  }

  static compileSubroutineCall(it: PeekIterator<Token>, parentNode: ASTNode) {
    let token = it.next()!

    //subroutineName
    parentNode.addChild(new ASTNode(token.type, token.value))

    token = it.next()!
    if (token.value === '(') {
      // (
      parentNode.addChild(new ASTNode(token.type, token.value))

      const expressionList = CompilationEngine.compileExpressionList(it)
      parentNode.addChild(expressionList)
      // )
      token = it.next()!
      parentNode.addChild(new ASTNode(token.type, token.value))
    } else if (token.value === '.') {
      // .
      parentNode.addChild(new ASTNode(token.type, token.value))

      // subroutineName
      token = it.next()!
      parentNode.addChild(new ASTNode(token.type, token.value))

      token = it.next()!
      if (token.value === '(') {
        // (
        parentNode.addChild(new ASTNode(token.type, token.value))

        const expressionList = CompilationEngine.compileExpressionList(it)
        parentNode.addChild(expressionList)
        // )
        token = it.next()!
        parentNode.addChild(new ASTNode(token.type, token.value))
      }
    }
  }
}

export default CompilationEngine
