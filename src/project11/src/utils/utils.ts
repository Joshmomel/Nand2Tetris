import Token from '../Token'
import ASTNode from '../ASTNode'
import fs from 'fs'

export const filePath = process.argv[2] ?? 'static/Main.jack'

export const symbolConvert = (c: string): string => {
  if (c === '<') return '&lt;'
  else if (c === '>') return '&gt;'
  else if (c === '&') return '&amp;'
  else return c
}

export const print = (token: Token) => {
  console.log(`** <${token.type}> ${token.value} </${token.type}>`)
}

export const printTreeConsole = (node: ASTNode, depth: number) => {
  if (node != null) {
    let tab = ''
    for (let i = 0; i < depth; i++) {
      tab += '  '
    }
    if (node.type === 'program') {
      console.log(`${tab}<${node.label}>`)
    } else {
      console.log(`${tab}<${node.type}> ${node.label} </${node.type}>`)
    }
    for (let i = 0; i < node.children.length; i++) {
      printTreeConsole(node.children[i], depth + 1)
    }
    if (node.type === 'program') console.log(`${tab}</${node.label}>`)
  }
}

export const printTreeString = (node: ASTNode, depth: number, fileName: string) => {
  if (node != null) {
    let tab = ''
    for (let i = 0; i < depth; i++) {
      tab += '  '
    }
    if (node.type === 'program') {
      fs.appendFileSync(fileName, `${tab}<${node.label}>`)
    } else {
      fs.appendFileSync(fileName, `${tab}<${node.type}> ${node.label} </${node.type}>`)
    }
    for (let i = 0; i < node.children.length; i++) {
      printTreeString(node.children[i], depth + 1, fileName)
    }
    if (node.type === 'program') {
      fs.appendFileSync(fileName, `${tab}</${node.label}>`)
    }
  }
}

const opList = ['+', '-', '*', '/', '&', '|', '<', '>', '=', '&lt;', '&gt;', '&amp;']
const unaryOpList = ['-', '~']

const keywordConstants = ['true', 'false', 'null', 'this']

export const isOp = (token: Token) => {
  const value = token.value
  return opList.includes(value)
}

export const isKeywordConstant = (token: Token) => {
  const value = token.value
  return keywordConstants.includes(value)
}

export const isUnaryOp = (token: Token) => {
  const value = token.value
  return unaryOpList.includes(value)
}
