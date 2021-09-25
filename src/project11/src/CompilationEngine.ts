import Token from './Token'
import {arrayToGenerator} from './utils/arrayToChar'
import PeekIterator from './utils/PeekIterator'
import ASTNode from './ASTNode'
import {isKeywordConstant, isOp, isUnaryOp} from './utils/utils'
import SymbolTable, {Kind} from "./SymbolTable";
import VMWriter, {ArithmeticCommand, PopSegment, PushSegment} from "./VMWriter";
import {opToCode} from "./utils/constants";

class CompilationEngine {
  private readonly mainTable: SymbolTable;
  private readonly subTable: SymbolTable;
  private readonly vm: VMWriter;
  private className: string;
  private onArithmeticCommand: ArithmeticCommand | undefined
  private whileIndex: number;
  private ifIndex: number;


  constructor() {
    this.mainTable = new SymbolTable()
    this.subTable = new SymbolTable()
    this.vm = new VMWriter()
    this.className = ''
    this.onArithmeticCommand = undefined
    this.whileIndex = 0
    this.ifIndex = 0
  }

  getVm() {
    return this.vm
  }

  setClassName(name: string) {
    this.className = name
  }


  getClassName() {
    return this.className
  }

  setOnArithmeticCommand(command: ArithmeticCommand) {
    this.onArithmeticCommand = command
  }

  clearOnArithmeticCommand() {
    this.onArithmeticCommand = undefined
  }

  analyse(tokens: Token[]): ASTNode | undefined {
    let p
    const it = new PeekIterator(arrayToGenerator(tokens)) as PeekIterator<Token>
    while (it.hasNext()) {
      const token = it.next()
      if (token && token.value === 'class') {
        it.putBack()
        p = this.compileClass(it)
      }
    }
    return p
  }

  compileClass(it: PeekIterator<Token>) {
    let token: Token

    token = it.next()!
    // parent: <class>
    const parent = new ASTNode('program', 'class')
    parent.addChild(new ASTNode(token.type, token.value))
    // print(token)

    // <identifier>Main</identifier>
    token = it.next() as Token
    parent.addChild(new ASTNode(token.type, token.value))
    this.setClassName(token.value)

    // children: <symbol> { </symbol>
    token = it.next() as Token
    parent.addChild(new ASTNode(token.type, token.value))
    // print(token)

    while (it.hasNext()) {
      const token = it.next() as Token

      console.log('compileClass token type is', token.value)
      switch (token.value) {
        case '}':
          parent.addChild(new ASTNode(token.type, token.value))
          break
        case 'static':
        case 'field':
          let classVarDec = null
          it.putBack()
          if ((classVarDec = this.compileClassVarDec(it)) !== null) {
            parent.addChild(classVarDec)
          }
          break
        case 'constructor':
        case 'function':
        case 'method':
          let compileSubroutineDec = null
          it.putBack()
          if ((compileSubroutineDec = this.compileSubroutineDec(it)) !== null) {
            parent.addChild(compileSubroutineDec)
          }
          break
      }
    }

    return parent
  }

  compileClassVarDec(it: PeekIterator<Token>) {
    // <keyword> static/field </keyword>
    const field = it.peek()!.value as Kind
    console.log('compileClassVarDec field is', field)
    const token = it.next()!
    const classVarDec = new ASTNode('program', 'classVarDec')
    classVarDec.addChild(new ASTNode(token.type, token.value))
    console.log('add child', token)


    let keyword;

    //type
    if (it.peek()?.type === 'keyword' || it.peek()?.type === 'identifier') {
      keyword = it.next()?.value
      console.log('keyword here is ', keyword)
    }

    while (it.hasNext()) {
      const token = it.next() as Token
      if (token.type === 'identifier' && keyword) {
        console.log('Define mainTable', token.value, keyword, field)
        this.mainTable.define(token.value, keyword, field)
      }
      classVarDec.addChild(new ASTNode(token.type, token.value))
      if (token.value === ';') break
    }

    return classVarDec
  }

  compileSubroutineDec(it: PeekIterator<Token>) {
    this.subTable.reset()

    const token = it.next()!

    let isConstructor, isFunction, isMethod = false
    let functionName, type
    console.log('*** temp 1 ', token.value)
    //(constructor | function | method)
    if (token.value === 'constructor' || token.value === 'function' || token.value === 'method') {
      isConstructor = token.value === 'constructor'
      isMethod = token.value === 'method'
      isFunction = token.value === 'function'
    }

    const classVarDec = new ASTNode('program', 'subroutineDec')
    classVarDec.addChild(new ASTNode(token.type, token.value))

    if (it.hasNext()) {
      let token

      token = it.next()!
      console.log('*** temp 2', token.value)

      //type
      classVarDec.addChild(new ASTNode(token.type, token.value))
      type = token.value
      token = it.next()!

      console.log('*** temp 3', token.value)


      //subroutineName
      functionName = token.value
      if (isConstructor) {
        functionName = type + '.' + functionName
      } else {
        functionName = this.getClassName() + '.' + token.value
      }
      classVarDec.addChild(new ASTNode(token.type, token.value))
      token = it.next()!

      //parameterList
      if (token.value === '(') {
        classVarDec.addChild(new ASTNode(token.type, token.value))
        const parameterListNodes = this.compileParameterList(it, isMethod)

        classVarDec.addChild(parameterListNodes)
        const closeBracket = it.next()!

        classVarDec.addChild(new ASTNode(closeBracket.type, closeBracket.value))
        token = it.next()!
      }

      //subroutineBody
      if (token.value === '{') {
        it.putBack()

        const subroutineBodyNode = this.compileSubroutineBody(it, functionName, isMethod, isFunction)
        classVarDec.addChild(subroutineBodyNode)
      }
    }

    return classVarDec
  }

  compileParameterList(it: PeekIterator<Token>, isMethod: boolean) {
    const parameterList = new ASTNode('program', 'parameterList')

    let name, type

    if (isMethod) {
      this.subTable.define('this', 'object', 'argument')
      console.log('isMethod subTable define in subTable this')
    }


    while (it.hasNext()) {
      const token = it.next()
      if (token == null) break
      if (token.value === ')') {
        it.putBack()
        break
      }
      /**
       * var int value;
       * define: value, int, argument
       */
      console.log('token is', token)

      if ((token.type === 'keyword' || token.type === 'identifier') && it.peek()?.type === 'identifier') {
        type = token.value
        name = it.peek()?.value
      }

      if (name && type) {
        console.log(`name ${name} type ${type}`)

        console.log('Var define in subTable ', name, type)
        this.subTable.define(name, type, 'argument')
        name = undefined
        type = undefined
      }
      parameterList.addChild(new ASTNode(token.type, token.value))
    }

    // console.log('subTable is', this.subTable)
    return parameterList
  }

  compileSubroutineBody(it: PeekIterator<Token>, functionName: string, isMethod: boolean, isFunction: boolean = false) {
    const token = it.next()!
    const subroutineBody = new ASTNode('program', 'subroutineBody')
    subroutineBody.addChild(new ASTNode(token.type, token.value))

    let localNumber = 0

    while (it.hasNext()) {
      const token = it.next()
      console.log('compileSubroutineBody token', token)

      if (token === null) break

      if (token.value === '}') {
        subroutineBody.addChild(new ASTNode(token.type, token.value))
        break
      }

      if (token.value === 'var') {
        it.putBack()
        const varDec = this.compileVarDec(it)
        subroutineBody.addChild(varDec)
        const symbolNodes = ASTNode.getByType(varDec, ['symbol'])

        localNumber += symbolNodes.length
        console.log('compileSubroutineBody get var ', token, 'localNumber is', localNumber)
      } else {
        //vm

        this.vm.writeFunction(functionName, localNumber)
        console.log('** temp vm writeFunction', functionName, localNumber)

        console.log(`function ${functionName} isMethod? ${isMethod}`)

        if (!isFunction) {
          if (!isMethod) {
            const fileNumber = this.mainTable.varCount('field')
            this.vm.writePush('constant', fileNumber)
            this.vm.writeCall('Memory.alloc', 1)
            this.vm.writePop('pointer', 0)
          } else {
            this.vm.writePush('argument', 0)
            this.vm.writePop('pointer', 0)
          }
        }


        it.putBack()
        const statement = this.compileStatements(it)
        subroutineBody.addChild(statement)
      }
    }

    return subroutineBody
  }

  compileVarDec(it: PeekIterator<Token>) {
    const token = it.next()!
    const varDec = new ASTNode('program', 'varDec')
    varDec.addChild(new ASTNode(token.type, token.value))

    console.log('compileVarDec', token)

    //type
    const nextToken = it.next()
    let varType = nextToken?.value!
    console.log('varType is', varType)
    varDec.addChild(new ASTNode(nextToken?.type, nextToken?.value))


    while (it.hasNext()) {
      const token = it.next()

      if (token === null) break

      if (token.value === ';') {
        varDec.addChild(new ASTNode(token.type, token.value))
        break
      }

      varDec.addChild(new ASTNode(token.type, token.value))

      if (token.type === 'identifier') {
        this.subTable.define(token.value, varType, 'var')
      }


    }

    return varDec
  }

  compileStatements(it: PeekIterator<Token>) {
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
        const letStatement = this.compileLet(it)
        statements.addChild(letStatement)
      } else if (token.value === 'if') {
        it.putBack()
        const ifStatement = this.compileIf(it)
        statements.addChild(ifStatement)
      } else if (token.value === 'while') {
        it.putBack()
        const whileStatement = this.compileWhile(it)
        statements.addChild(whileStatement)
      } else if (token.value === 'do') {
        it.putBack()
        const doStatement = this.compileDo(it)
        statements.addChild(doStatement)
        this.vm.writePop('temp', 0)
      } else if (token.value === 'return') {
        it.putBack()
        const returnStatement = this.compileReturn(it)
        statements.addChild(returnStatement)
      }
    }

    return statements
  }

  compileLet(it: PeekIterator<Token>) {
    const token = it.next()!
    const letStatement = new ASTNode('program', 'letStatement')

    let variable = ''

    // let
    letStatement.addChild(new ASTNode(token.type, token.value))

    if (it.hasNext()) {
      let token
      let lookahead
      //varName
      token = it.next()!
      letStatement.addChild(new ASTNode(token.type, token.value))
      variable += token.value

      lookahead = it.peek()
      if (lookahead && lookahead.value === '[') {
        // [
        let token = it.next()!
        letStatement.addChild(new ASTNode(token.type, token.value))

        const expression = this.compileExpression(it)
        letStatement.addChild(expression)

        // ]
        token = it.next()!
        this.writeVariable(variable)
        letStatement.addChild(new ASTNode(token.type, token.value))

        this.vm.writeArithmetic('ADD');
        if (it.peek()?.value === '=') {
          it.next()
          const expression = this.compileExpression(it)
          letStatement.addChild(expression)

          this.vm.writePop('temp', 0);
          this.vm.writePop('pointer', 1);
          this.vm.writePush('temp', 0);
          this.vm.writePop('that', 0);
        }

      }

      lookahead = it.peek()
      if (lookahead && lookahead.value === '=') {
        token = it.next()!
        letStatement.addChild(new ASTNode(token.type, token.value))
        const expression = this.compileExpression(it)
        letStatement.addChild(expression)
        console.log('** let variable is ', variable)
        this.writeVariable(variable, true)
      }

      token = it.next()
      if (token && token.value === ';') {
        letStatement.addChild(new ASTNode(token.type, token.value))
      }
    }

    return letStatement
  }

  compileIf(it: PeekIterator<Token>) {
    let token = it.next()!
    let tempIndex = this.ifIndex++
    const ifStatement = new ASTNode('program', 'ifStatement')
    ifStatement.addChild(new ASTNode(token.type, token.value))

    // (
    token = it.next()!
    ifStatement.addChild(new ASTNode(token.type, token.value))

    const expression = this.compileExpression(it)
    ifStatement.addChild(expression)

    //)
    token = it.next()!
    ifStatement.addChild(new ASTNode(token.type, token.value))
    this.vm.writeIf('IF_TRUE' + tempIndex);
    this.vm.writeGoto('IF_FALSE' + tempIndex);

    let lookahead = it.peek()
    if (lookahead && lookahead.value === '{') {
      //{
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))
      this.vm.writeLabel('IF_TRUE' + tempIndex)

      const statements = this.compileStatements(it)
      ifStatement.addChild(statements)

      //}
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))
    }

    lookahead = it.peek()
    // console.log('lookahead is', lookahead)

    if (lookahead && lookahead!.value !== 'else') {
      this.vm.writeLabel('IF_FALSE' + tempIndex)
    }

    while (lookahead && lookahead.value === 'else') {
      // else
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))
      this.vm.writeGoto('IF_END' + tempIndex)
      this.vm.writeLabel('IF_FALSE' + tempIndex)
      //{
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      const statements = this.compileStatements(it)
      ifStatement.addChild(statements)
      this.vm.writeLabel('IF_END' + tempIndex)

      //}
      token = it.next()!
      ifStatement.addChild(new ASTNode(token.type, token.value))

      lookahead = it.peek()
    }


    return ifStatement
  }

  compileWhile(it: PeekIterator<Token>) {
    let tempIndex = this.whileIndex++;
    let token = it.next()!

    const whileStatement = new ASTNode('program', 'whileStatement')
    whileStatement.addChild(new ASTNode(token.type, token.value))
    this.vm.writeLabel('WHILE_EXP' + String(tempIndex))

    // (
    token = it.next()!
    whileStatement.addChild(new ASTNode(token.type, token.value))

    const expression = this.compileExpression(it)
    whileStatement.addChild(expression)
    this.vm.writeArithmetic('NOT');
    this.vm.writeIf('WHILE_END' + tempIndex);

    //)
    token = it.next()!
    whileStatement.addChild(new ASTNode(token.type, token.value))

    const lookahead = it.peek()
    if (lookahead && lookahead.value === '{') {
      //{
      token = it.next()!
      whileStatement.addChild(new ASTNode(token.type, token.value))

      const statements = this.compileStatements(it)
      whileStatement.addChild(statements)

      this.vm.writeGoto('WHILE_EXP' + String(tempIndex))
      this.vm.writeLabel('WHILE_END' + String(tempIndex))

      //}
      token = it.next()!
      whileStatement.addChild(new ASTNode(token.type, token.value))
    }

    return whileStatement
  }

  compileDo(it: PeekIterator<Token>) {
    const token = it.next()!
    const doStatement = new ASTNode('program', 'doStatement')
    doStatement.addChild(new ASTNode(token.type, token.value))

    this.compileSubroutineCall(it, doStatement)
    if (it.hasNext() && it.peek()!.value === ';') {
      const token = it.next()!
      doStatement.addChild(new ASTNode(token.type, token.value))
    }

    return doStatement
  }

  compileReturn(it: PeekIterator<Token>) {
    let token = it.next()!
    const returnStatement = new ASTNode('program', 'returnStatement')
    //return
    returnStatement.addChild(new ASTNode(token.type, token.value))

    // return without parameter
    if (it.hasNext() && it.peek()!.value === ';') {
      token = it.next()!
      returnStatement.addChild(new ASTNode(token.type, token.value))
      this.vm.writePush('constant', 0)
      this.vm.writeReturn()

      return returnStatement
    }

    if (it.hasNext() && it.peek()!.value !== ';') {
      const expression = this.compileExpression(it)
      returnStatement.addChild(expression)
    }

    //;
    token = it.next()!
    returnStatement.addChild(new ASTNode(token.type, token.value))
    this.vm.writeReturn()

    return returnStatement
  }

  compileExpression(it: PeekIterator<Token>) {
    let hasOp = false
    let opCode
    const expression = new ASTNode('program', 'expression')

    // term
    const term = this.compileTerm(it)
    expression.addChild(term)

    const lookahead = it.peek()
    if (lookahead && isOp(lookahead)) {
      // op
      const token = it.next()!
      expression.addChild(new ASTNode(token.type, token.value))
      hasOp = true
      // @ts-ignore
      opCode = opToCode[token.value]

      // term
      const term = this.compileTerm(it)
      expression.addChild(term)
    }

    // write op if necessary
    if (hasOp) {
      this.vm.writeArithmetic(opCode)
    }

    return expression
  }

  compileTerm(it: PeekIterator<Token>) {
    let token = it.next()!
    let tempName;

    const term = new ASTNode('program', 'term')

    if (token.type === 'identifier') {
      const identifierNode = new ASTNode(token.type, token.value)
      tempName = token.value

      const lookahead = it.peek()
      if (lookahead && lookahead.value === '[') {
        // identifier
        term.addChild(identifierNode)

        // [
        let token = it.next()!
        term.addChild(new ASTNode(token.type, token.value))

        //expression
        const expression = this.compileExpression(it)
        term.addChild(expression)

        // ]
        token = it.next()!
        term.addChild(new ASTNode(token.type, token.value))

        console.log('*** tempName in compile term', tempName)
        this.writeVariable(tempName)
        this.vm.writeArithmetic('ADD');
        this.vm.writePop('pointer', 1);
        this.vm.writePush('that', 0);

      } else if (lookahead && (lookahead.value === '(' || lookahead.value === '.')) {
        it.putBack()
        this.compileSubroutineCall(it, term)
      } else {
        // only identifier
        term.addChild(identifierNode)
        // console.log('identifierNode', token.value)
        this.writeVariable(token.value)
      }
    } else if (token.type === 'integerConstant') {
      console.log('writePush constant', Number(token.value))
      this.vm.writePush('constant', Number(token.value))
      if (this.onArithmeticCommand) {
        this.vm.writeArithmetic(this.onArithmeticCommand)
        this.clearOnArithmeticCommand()
      }
      term.addChild(new ASTNode(token.type, token.value))
    } else if (token.type === 'stringConstant') {
      term.addChild(new ASTNode(token.type, token.value))

      // @ts-ignore
      let stringArray = [...token.value]
      let code

      this.vm.writePush('constant', stringArray.length)
      this.vm.writeCall('String.new', 1);
      stringArray.forEach(str => {
        code = str.charCodeAt();
        this.vm.writePush('constant', code)
        this.vm.writeCall('String.appendChar', 2)
      })

    } else if (token.value === '(') {
      // (
      term.addChild(new ASTNode(token.type, token.value))

      //expression
      const expression = this.compileExpression(it)
      term.addChild(expression)

      // )
      token = it.next()!
      term.addChild(new ASTNode(token.type, token.value))
    } else if (isKeywordConstant(token)) {
      term.addChild(new ASTNode(token.type, token.value))
      //process keywords
      console.log('keywords', token)
      const keywordType = token.value
      if (keywordType === 'true') {
        this.vm.writePush('constant', 0)
        this.vm.writeArithmetic('NOT')
      }
      if (keywordType === 'false' || keywordType === 'null') {
        this.vm.writePush('constant', 0)
      }
      if (keywordType === '-') {
        this.vm.writeArithmetic('NEG')
      }
      if (keywordType === 'this') {
        this.vm.writePush('pointer', 0)
      }
    } else if (isUnaryOp(token)) {
      console.log('isUnaryOp', token)
      const unaryOp = token.value
      if (unaryOp === '-') {
        term.addChild(new ASTNode(token.type, token.value))
        const newTerm = this.compileTerm(it)
        term.addChild(newTerm)
        this.vm.writeArithmetic('NEG')
      }
      if (unaryOp === '~') {
        term.addChild(new ASTNode(token.type, token.value))
        const newTerm = this.compileTerm(it)
        term.addChild(newTerm)
        this.vm.writeArithmetic('NOT')
      }


    } else {
      //Error
      console.log('----- compileTerm error', token)
    }

    return term
  }


  compileExpressionList(it: PeekIterator<Token>) {
    const expressionListStatement = new ASTNode('program', 'expressionList')

    while (it.peek() && it.peek()!.value !== ')') {
      const token = it.next()!

      if (token.value === ';') break

      if (token.value !== ',') {
        // expression
        it.putBack()
        const expression = this.compileExpression(it)
        expressionListStatement.addChild(expression)
      } else {
        // ,
        expressionListStatement.addChild(new ASTNode(token.type, token.value))
      }
    }

    return expressionListStatement
  }

  compileSubroutineCall(it: PeekIterator<Token>, parentNode: ASTNode) {
    let token = it.next()!
    let functionName = token.value
    let varName = ''
    let nArgs = 0

    console.log(`functionName is ${functionName} token value is ${token.value}`)
    //TODO: check getTypeOfVariable return value
    const typeOfVariable = this.getTypeOfVariable(token.value)
    console.log('type is', typeOfVariable)
    if (typeOfVariable.isMethod) {
      functionName = typeOfVariable.type
      varName = token.value
    }
    console.log('varName is', varName)

    //subroutineName
    parentNode.addChild(new ASTNode(token.type, token.value))

    token = it.next()!
    if (token.value === '(') {
      // (
      parentNode.addChild(new ASTNode(token.type, token.value))
      functionName = this.getClassName() + '.' + functionName
      nArgs++
      this.vm.writePush('pointer', 0)


      const expressionList = this.compileExpressionList(it)
      parentNode.addChild(expressionList)
      const args = ASTNode.getByLabel(expressionList, 'expression')
      nArgs += args.length

      // )
      token = it.next()!
      parentNode.addChild(new ASTNode(token.type, token.value))
    } else if (token.value === '.') {
      // .
      parentNode.addChild(new ASTNode(token.type, token.value))

      // subroutineName
      token = it.next()!
      parentNode.addChild(new ASTNode(token.type, token.value))
      functionName += `.${token.value}`

      token = it.next()!
      if (token.value === '(') {
        // (
        parentNode.addChild(new ASTNode(token.type, token.value))

        if (typeOfVariable.isMethod) {
          this.writeVariable(varName)
        }

        const expressionList = this.compileExpressionList(it)
        parentNode.addChild(expressionList)


        const args = ASTNode.getByLabel(expressionList, 'expression')
        const symbolNodes = ASTNode.getByLabel(expressionList, ',')
        console.log('args len', args.length)
        console.log('symbolNodes', symbolNodes.length, ' functionName', functionName, ' isMethod', typeOfVariable.isMethod)

        nArgs = symbolNodes.length > 0 ? symbolNodes.length + 1 : args.length > 1 ? 1 : args.length
        if (typeOfVariable.isMethod) {
          nArgs++
        }

        // )
        token = it.next()!
        parentNode.addChild(new ASTNode(token.type, token.value))
      }
    }

    console.log('functionName is', functionName, 'nArgs is ', nArgs)
    this.vm.writeCall(functionName, nArgs)
  }

  writeVariable(value: string, isPop: boolean = false) {
    console.log('1 writeVariable is call with value', value)
    // console.log('2 subTable is ', this.subTable)
    let segment: string = this.subTable.kindOf(value)
    console.log('3 segment is', segment)


    // not exist in subTable
    if (!segment || segment === 'none') {
      segment = this.mainTable.kindOf(value)
      console.log('3.1 segment mainTable is', segment)

      if (segment === 'field') {
        segment = 'this'
      }
      if (isPop) {
        console.log('mainTable var write pop ', segment, ' index ', this.mainTable.indexOf(value));
        this.vm.writePop(segment as PopSegment, this.mainTable.indexOf(value))
      } else {
        console.log('mainTable var write push ', segment, ' index ', this.mainTable.indexOf(value));
        this.vm.writePush(segment as PushSegment, this.mainTable.indexOf(value))
      }
    } else {
      // exist int subTable

      if (segment === 'var') segment = 'local'

      if (isPop) {
        console.log('subTable var write pop ', segment, ' index ', this.subTable.indexOf(value));
        this.vm.writePop(segment as PopSegment, this.subTable.indexOf(value))
      } else {
        console.log('subTable var write push ', segment, ' index ', this.subTable.indexOf(value));
        this.vm.writePush(segment as PushSegment, this.subTable.indexOf(value))
      }
    }
  }

  getTypeOfVariable(name: string) {
    let type = this.subTable.typeOf(name);

    if (type === 'none') {
      type = this.mainTable.typeOf(name);
      if (type === 'none') {
        return {type, isMethod: false};
      } else {
        return {type, isMethod: true};
      }
    } else {
      return {type, isMethod: true};
    }
  }
}

export default CompilationEngine
