import {readFileSync} from 'node:fs'

function readInput() {
  return readFileSync('./day01.data', {encoding: 'utf8'}).split('\n')
}

function part1() {
  let mostCalories = 0

  let currentElf = 0
  readInput().map(line => {
    if (!line.length) {
      mostCalories = Math.max(mostCalories, currentElf)
      currentElf = 0
    }
    currentElf += Number(line)
  })

  return mostCalories
}

function part2() {
  const calories = []

  let currentElf = 0
  readInput().map(line => {
    if (!line.length) {
      calories.push(currentElf)
      currentElf = 0
    }
    currentElf += Number(line)
  })

  return calories
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, val) => sum + val, 0)
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
