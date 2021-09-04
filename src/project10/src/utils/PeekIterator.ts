import {EndToken, PeekIteratorGenerator} from "../types";

class PeekIterator<T> {
  private static CACHE_SIZE = 10
  private it: PeekIteratorGenerator<T>
  private readonly stackPutBacks: Array<T>
  private queueCache: Array<T>
  private endToken: T | null

  constructor(it: PeekIteratorGenerator<T>, endToken: EndToken<T> = null) {
    this.it = it
    this.stackPutBacks = []
    this.queueCache = []
    this.endToken = endToken
  }

  next() {
    let value

    if (this.stackPutBacks.length > 0) {
      value = this.stackPutBacks.pop() as T
    } else {
      value = this.it.next().value
      if (value === undefined) {
        const temp = this.endToken
        this.endToken = null
        value = temp
      }
    }

    while (this.queueCache.length > PeekIterator.CACHE_SIZE - 1) {
      this.queueCache.shift()
    }

    if (value !== null) this.queueCache.push(value)

    return value
  }

  putBack() {
    if (this.queueCache.length > 0) {
      this.stackPutBacks.push(this.queueCache.pop()!)
    }
  }

  hasNext() {
    return this.endToken || !!this.peek()
  }

  peek() {
    if (this.stackPutBacks.length > 0) {
      return this.stackPutBacks[this.stackPutBacks.length - 1]
    }

    const value = this.next()
    this.putBack()
    return value
  }
}

export default PeekIterator
