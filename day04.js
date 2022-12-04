import { readFileSync } from 'node:fs'

function readInput() {
  return readFileSync('./day04.data', {encoding: 'utf8'}).split('\n').filter(r => r)
}

/**
 * @typedef {[number, number]} Tuple
 * @param {string} line
 * @return {[Tuple, Tuple]}
 */
function lineToTuples(line) {
  return line.split(',')
    .map(range => range.split('-'))
    .map(([start, end]) => [Number(start), Number(end)])
}

/**
 *
 * @param {Tuple} first
 * @param {Tuple} second
 * @return {boolean}
 */
function fullIntersect(first, second) {
  return (
    (first[0] <= second[0] && first[1] >= second[1]) || // First wraps second
    (first[0] >= second[0] && first[1] <= second[1]) // Second wraps first
  )
}

/**
 *
 * @param {Tuple} first
 * @param {Tuple} second
 * @return {boolean}
 */
function partialIntersect(first, second) {
  return (
    (first[0] <= second[0] && first[1] >= second[0]) || // First intersects start of second
    (first[0] <= second[1] && first[1] >= second[1]) || // First intersects end of second
    (first[0] >= second[0] && first[1] <= second[1]) // Second wraps first
  )
}

function part1() {
  return readInput()
    .map(lineToTuples)
    .filter(([first, second]) => fullIntersect(first, second))
    .length
}

function part2() {
  return readInput()
    .map(lineToTuples)
    .filter(([first, second]) => partialIntersect(first, second))
    .length
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
