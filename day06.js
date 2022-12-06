import { readFileSync } from 'node:fs'

function readInput() {
  return readFileSync('./day06.data', {encoding: 'utf8'})
}

function allUnique(input) {
  return Array.from(new Set(input.split(''))).length === input.length
}

function solution(PACKET_LENGTH) {
  const data = readInput()
  for (let counter = 0; (counter + PACKET_LENGTH) < data.length; counter++) {
    if (allUnique(data.substring(counter, counter + PACKET_LENGTH))) {
      return counter + PACKET_LENGTH
    }
  }
}

console.log(`part1: ${solution(4)}`)
console.log(`part2: ${solution(14)}`)
