import {readData} from './utils'

function allUnique(input: string): boolean {
  return Array.from(new Set(input.split(''))).length === input.length
}

function solution(PACKET_LENGTH: number): number {
  const data = readData(6)[0]
  for (let counter = 0; (counter + PACKET_LENGTH) < data.length; counter++) {
    if (allUnique(data.substring(counter, counter + PACKET_LENGTH))) {
      return counter + PACKET_LENGTH
    }
  }
  throw new Error('No solution could be found')
}

console.log(`part1: ${solution(4)}`)
console.log(`part2: ${solution(14)}`)
