import { readFileSync } from 'node:fs'

function readInput() {
  return readFileSync('./day05.data', {encoding: 'utf8'}).split('\n').filter(r => r)
}

/**
 *
 * @param {string[]} lines
 * @return {[number[][], {num: number, from: number, to: number}[]]}
 */
function splitInput(lines) {
  const stacks = [[],[],[],[],[],[],[],[],[]]
  const moves = []

  let row = 0

  // Parse all stack rows until we get to the line containing stack numbering -- i.e. starting with a '1'
  while (true) {
    const line = lines[row++]
    if (line[1] === '1') break

    // Parse each line by finding the letter inside the box (offset by 1),
    // then moving cursor to next box (increase by 4) -- [A] [B] [C]
    for (let i = 1; i < line.length; i += 4) {
      // If there is no box, ignore it, otherwise save it to the start of the bottom of the stack
      if (line[i] !== ' ') stacks[Math.floor(i / 4)].unshift(line[i])
    }
  }

  // Loop over the rest of the lines, parsing the moves
  for (; row < lines.length; row++) {
    // If the line matches the format 'move [num] from [from] to [to]' we get a match and values
    const [match, num, from, to] = /move (\d+) from (\d+) to (\d+)/.exec(lines[row])
    if (match) {
      moves.push({num: Number(num), from: Number(from), to: Number(to)})
    }
  }

  return [stacks, moves]
}

function part1() {
  const [stacks, moves] = splitInput(readInput())
  moves.forEach(({num, from, to}) => {
    for (let i = 0; i < num; i++) {
      // Move the top box from the from-stack to the to-stack
      stacks[to - 1].push(stacks[from - 1].pop())
    }
  })
  return stacks.map(stack => stack.pop()).join('')
}

function part2() {
  const [stacks, moves] = splitInput(readInput())
  moves.forEach(({num, from, to}) => {
    // Move num boxes from the top of the from-stack to the to-stack
    stacks[to - 1].push(...stacks[from - 1].splice(stacks[from - 1].length - num, num))
  })
  return stacks.map(stack => stack.pop()).join('')
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
