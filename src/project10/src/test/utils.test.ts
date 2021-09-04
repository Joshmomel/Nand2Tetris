import {isOp} from "../utils/utils";
import Token from "../Token";

describe('utils', () => {
  describe('isOP', () => {
    it('return true when input is op', function () {
      const token = new Token('symbol', '+')
      const isOperation = isOp(token)
      expect(isOperation).toBe(true)
    });
  })
})
