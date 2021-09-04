import PeekIterator from '../utils/PeekIterator'
import { arrayToGenerator } from '../utils/arrayToChar'

describe('PeekIterator', () => {
  it('returns correct next item', function () {
    let peekIterator = new PeekIterator(arrayToGenerator(['a', 'b', 'c', 'd', 'e', 'f', 'g']))

    expect(peekIterator.next()).toBe('a')
    expect(peekIterator.next()).toBe('b')
    expect(peekIterator.next()).toBe('c')
    expect(peekIterator.next()).toBe('d')
    expect(peekIterator.next()).toBe('e')
    expect(peekIterator.next()).toBe('f')
    expect(peekIterator.next()).toBe('g')
  })

  it('put back item correctly', function () {
    let peekIterator = new PeekIterator(arrayToGenerator(['a', 'b', 'c', 'd', 'e', 'f', 'g']))

    expect(peekIterator.next()).toBe('a')
    expect(peekIterator.next()).toBe('b')
    expect(peekIterator.next()).toBe('c')
    peekIterator.putBack()
    peekIterator.putBack()
    expect(peekIterator.next()).toBe('b')
    expect(peekIterator.next()).toBe('c')
  })

  it('should peek and return hasNext correctly', function () {
    let peekIterator = new PeekIterator(arrayToGenerator(['a', 'b', 'c', 'd', 'e', 'f', 'g']))
    expect(peekIterator.next()).toBe('a')
    expect(peekIterator.peek()).toBe('b')
    expect(peekIterator.peek()).toBe('b')
    expect(peekIterator.next()).toBe('b')
    expect(peekIterator.next()).toBe('c')
    expect(peekIterator.next()).toBe('d')
    expect(peekIterator.next()).toBe('e')
    expect(peekIterator.next()).toBe('f')
    expect(peekIterator.hasNext()).toBe(true)
    expect(peekIterator.next()).toBe('g')
    expect(peekIterator.hasNext()).toBe(false)
  })

  it('add endToken correctly', () => {
    const it = new PeekIterator(arrayToGenerator(['a', 'b', 'c', 'd', 'e', 'f', 'g']), '\0')
    for (let i = 0; i < 8; i++) {
      if (i == 7) {
        expect(it.next()).toBe('\0')
      } else {
        expect(it.next()).toBe('abcdefg'[i])
      }
    }
  })
})
