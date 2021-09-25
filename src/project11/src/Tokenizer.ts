import { symbols } from './utils/constants'
import PeekIterator from './utils/PeekIterator'
import Token from './Token'
import { arrayToGenerator } from './utils/arrayToChar'
import AlphabetHelper from './utils/AlphabetHelper'
import {symbolConvert} from "./utils/utils";


class Tokenizer {
  static analyse(source: string) {
    const tokens: Token[] = []
    const it = new PeekIterator(arrayToGenerator(source), '\0') as PeekIterator<string>

    while (it.hasNext()) {
      let c = it.next()
      if (c == '\0') break

      let lookahead = it.peek()

      if (c === '' || c == '\n' || c == '\r') continue

      /** trim comments*/
      if (c === '/') {
        if (lookahead === '/') {
          while (it.hasNext() && it.peek() != '\n') {
            c = it.next()
          }
          c=it.next()
        } else if (lookahead === '*') {
          let valid = false
          while (it.hasNext()) {
            const p = it.next()
            if (p === '*' && it.peek() === '/') {
              valid = true
              it.next()
              break
            }
          }
          if (!valid) {
            throw new Error(`unexpected char ${c}`)
          }
          continue
        }
      }

      /**Symbols */
      if (symbols.includes(c!)) {
        tokens.push(new Token('symbol', symbolConvert(c!)))
        continue
      }

      /**stringConstant */
      if (c == '"') {
        tokens.push(Token.makeString(it) as Token)
        continue
      }

      /**keyword or identifier */
      if (AlphabetHelper.isLetter(c)) {
        it.putBack()
        tokens.push(Token.makeKeywordIdentifier(it))
        continue
      }

      /**integerConstant */
      if (AlphabetHelper.isNumber(c)) {
        it.putBack()
        tokens.push(Token.makeNumber(it) as Token)
      }
    }

    // console.log('token is', tokens)

    return tokens
  }
}

export default Tokenizer
