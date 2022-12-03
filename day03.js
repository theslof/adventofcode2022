import { readFileSync } from 'node:fs'

function readInput() {
  return readFileSync('./day03.data', {encoding: 'utf8'}).split('\n')
}

function isUpperCase(input) {
  return input === input.toUpperCase()
}

function getPriority(letter) {
  return isUpperCase(letter)
    ? letter.charCodeAt(0) - 'A'.charCodeAt(0) + 27
    : letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1
}

function part1() {
  return readInput()
    .map(line => {
      const first = line.slice(0, line.length / 2)
      const second = line.slice(line.length / 2)

      return Array.from(new Set(first.split('')))
        .filter(letter => second.includes(letter))
        .map(getPriority)
        .reduce((sum, val) => sum + val, 0)
    })
    .reduce((sum, value) => sum + value)
}

function part2() {
  const data = readInput()
  let result = 0
  for (let i = 0; (i + 2) < data.length; i += 3) {
    result += Array.from(new Set(data[i]))
      .filter(letter => (
        data[i + 1].includes(letter) &&
        data[i + 2].includes(letter)
      ))
      .map(getPriority)
      .reduce((sum, val) => sum + val, 0)
  }
  return result
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
