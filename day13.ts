import {readData} from './utils'

type RecursiveArray<T> = (RecursiveArray<T> | T)[]

function comparePair(left: RecursiveArray<number>, right: RecursiveArray<number>): number {
  let i = 0
  while (true) {
    const leftEl = left[i]
    const rightEl = right[i]
    if (leftEl == null && rightEl == null) {
      // Ran out of elements, no difference
      return 0
    } else if (leftEl == null) {
      // Left side ran out of elements, right order
      return -1
    } else if (rightEl == null) {
      // Right side ran out of elements, wrong order
      return 1
    }
    if (typeof leftEl === 'number' && typeof rightEl === 'number') {
      if (leftEl > rightEl) {
        // Left side is greater, wrong order
        return 1
      }
      if (rightEl > leftEl) {
        // Right side is greater, right order
        return -1
      }
    } else if (Array.isArray(leftEl) && Array.isArray(rightEl)) {
      const result = comparePair(leftEl, rightEl)
      if (result !== 0) return result
    } else {
      const result = comparePair(Array.isArray(leftEl) ? leftEl : [leftEl], Array.isArray(rightEl) ? rightEl : [rightEl])
      if (result !== 0) return result
    }
    i++
  }
}

function part1() {
  return readData(13, /\n\n/).map((pair) => {
    const [left, right] = pair.split('\n')
    return comparePair(JSON.parse(left), JSON.parse(right)) === -1
  }).reduce((sum, correct, index) => correct ? sum + index + 1 : sum, 0)
}

function part2() {
  return [...readData(13, /\n/), '[[2]]', '[[6]]']
    .filter(l => l)
    .map((line) => JSON.parse(line))
    .sort(comparePair)
    .reduce((product, value, index) => {
      if (
        JSON.stringify(value) === '[[2]]' ||
        JSON.stringify(value) === '[[6]]'
      ) return product * (index + 1)
      return product
    }, 1)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
