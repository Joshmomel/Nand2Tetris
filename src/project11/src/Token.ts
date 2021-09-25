import PeekIterator from './utils/PeekIterator'
import AlphabetHelper from './utils/AlphabetHelper'
import { keywords } from './utils/constants'

class Token {
  type: string
  value: string

  constructor(type: string, value: string) {
    this.type = type
    this.value = value
  }

  static makeKeywordIdentifier(it: PeekIterator<string>) {
    let s = ''

    while (it.hasNext()) {
      const c = it.peek()
      if (AlphabetHelper.isLiteral(c)) {
        s += c
      } else {
        break
      }
      it.next()
    }

    if (keywords.includes(s)) {
      return new Token('keyword', s)
    } else {
      return new Token('identifier', s)
    }
  }

  static makeString(it: PeekIterator<string>) {
    let s = ''

    while (it.hasNext()) {
      let c = it.next()

      if (c === '"') {
        return new Token('stringConstant', s)
      }

      s += c
    }
  }

  static makeNumber(it: PeekIterator<string>) {
    let s = ''

    while (it.hasNext()) {
      let c = it.next()

      if (AlphabetHelper.isNumber(c)) {
        s += c
      } else {
        it.putBack()
        return new Token('integerConstant', s)
      }
    }
  }
}

export default Token
