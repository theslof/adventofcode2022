import {readData} from './utils'

type RecursiveArray<T> = (RecursiveArray<T> | T)[]

function comparePair(left: RecursiveArray<number> | number, right: RecursiveArray<number> | number): number {
  // If both inputs are Numbers we only need to do a regular comparison
  if (typeof left === 'number' && typeof right === 'number') return left - right

  // Hack to convert number OR array to array, allows us to skip [number, Array] check and only do [Array, Array]
  const l = [left].flat()
  const r = [right].flat()

  while (l.length && r.length) {
    const result = comparePair(l.shift(), r.shift())
    if (result !== 0) return result
  }
  return l.length - r.length
}

function part1() {
  return readData(13, /\n\n/).map((pair) => {
    const [left, right] = pair.split('\n')
    return comparePair(JSON.parse(left), JSON.parse(right)) < 0
  }).reduce((sum, correct, index) => correct ? sum + index + 1 : sum, 0)
}

function part2() {
  const dividers = [[[2]], [[6]]]
  return readData(13, /\n/)
    .filter(l => l)
    .map(line => JSON.parse(line))
    .concat(dividers)
    .sort(comparePair)
    .reduce((product, value, index) => dividers.includes(value) ? product * (index + 1) : product, 1)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
