import { readFileSync } from 'node:fs'

function readInput() {
  return readFileSync('./day02.data', {encoding: 'utf8'}).split('\n')
}

function part1() {
  return readInput()
    .map(line => {
      if (!line.length) return 0
      const [first, second] = line.split(' ')

      switch (first) {
        case 'A': // Rock
          switch (second) {
            case 'X': // Rock
              return 1 + 3
            case 'Y': // Paper
              return 2 + 6
            case 'Z': // Scissor
              return 3
          }
        case 'B': // Paper
          switch (second) {
            case 'X': // Rock
              return 1
            case 'Y': // Paper
              return 2 + 3
            case 'Z': // Scissor
              return 3 + 6
          }
        case 'C': // Scissor
          switch (second) {
            case 'X': // Rock
              return 1 + 6
            case 'Y': // Paper
              return 2
            case 'Z': // Scissor
              return 3 + 3
          }
      }
    })
    .reduce((sum, value) => sum + value, 0)
}

function part2() {
  return readInput()
    .map(line => {
      if (!line.length) return 0
      const [first, second] = line.split(' ')

      switch (first) {
        case 'A': // Rock
          switch (second) {
            case 'X': // Lose
              return 3
            case 'Y': // Draw
              return 1 + 3
            case 'Z': // Win
              return 2 + 6
          }
        case 'B': // Paper
          switch (second) {
            case 'X': // Lose
              return 1
            case 'Y': // Draw
              return 2 + 3
            case 'Z': // Win
              return 3 + 6
          }
        case 'C': // Scissor
          switch (second) {
            case 'X': // Lose
              return 2
            case 'Y': // Draw
              return 3 + 3
            case 'Z': // Win
              return 1 + 6
          }
      }
    })
    .reduce((sum, value) => sum + value, 0)
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
