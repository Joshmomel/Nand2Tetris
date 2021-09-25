class AlphabetHelper {
  static ptnLetter = /^[a-zA-Z]$/
  static ptnNumber = /^[0-9]$/
  static ptnLiteral = /^[_a-zA-Z0-9]$/
  static ptnOperator = /^[+\-*/><=!&|^%,]$/

  static isLetter(c: any) {
    return AlphabetHelper.ptnLetter.test(c)
  }

  static isNumber(c: any) {
    return AlphabetHelper.ptnNumber.test(c)
  }

  static isLiteral(c: any) {
    return AlphabetHelper.ptnLiteral.test(c)
  }

  static isOperator(c: any) {
    return AlphabetHelper.ptnOperator.test(c)
  }
}

export default AlphabetHelper
