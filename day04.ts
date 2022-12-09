import {readData, Tuple} from './utils'

function lineToTuples(line: string): Tuple<number, number>[] {
  return line.split(',')
    .map(range => range.split('-'))
    .map(([start, end]) => [Number(start), Number(end)])
}

function fullIntersect(first: Tuple<number, number>, second: Tuple<number, number>): boolean {
  return (
    (first[0] <= second[0] && first[1] >= second[1]) || // First wraps second
    (first[0] >= second[0] && first[1] <= second[1]) // Second wraps first
  )
}

function partialIntersect(first: Tuple<number, number>, second: Tuple<number, number>): boolean {
  return (
    (first[0] <= second[0] && first[1] >= second[0]) || // First intersects start of second
    (first[0] <= second[1] && first[1] >= second[1]) || // First intersects end of second
    (first[0] >= second[0] && first[1] <= second[1]) // Second wraps first
  )
}

function part1(): number {
  return readData(4)
    .filter(l => l)
    .map(lineToTuples)
    .filter(([first, second]) => fullIntersect(first, second))
    .length
}

function part2(): number {
  return readData(4)
    .filter(l => l)
    .map(lineToTuples)
    .filter(([first, second]) => partialIntersect(first, second))
    .length
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
