import {readData} from './utils'

interface Monkey {
  items: number[]
  operation: {
    op: string
    by: string
  }
  test: {
    divisibleBy: number
    true: number
    false: number
  }
  inspections: number
}

function parseMonkeys(rawMonkeys: string[]): Monkey[] {
  return rawMonkeys.map(monkeyString => {
    const [, startingItems, operation, test, ifTrue, ifFalse] = monkeyString.split('\n')
    const [, op, by] = Array.from(operation.match(/Operation: new = old ([*+]) (\d+|old)/) ?? [])
    const monkey: Monkey = {
      items: Array.from(startingItems.matchAll(/(\d+)/g)).map(r => Number(r[0])),
      test: {
        divisibleBy: Number(test.split(' ').slice(-1)[0]),
        true: Number(ifTrue.split(' ').slice(-1)[0]),
        false: Number(ifFalse.split(' ').slice(-1)[0]),
      },
      operation: {
        op,
        by,
      },
      inspections: 0,
    }
    return monkey
  })
}

function solution(part1: boolean): number {
  const monkeys = parseMonkeys(readData(11, /\n\n/).filter(f => f))
  // For part 2 we need to find out the common denominator for all monkeys,
  // which is the product (multiplication) of all divisibleBy values.
  const modulo = monkeys.map(m => m.test.divisibleBy).reduce((product, val) => product * val)
  for (let round = 0; round < (part1 ? 20 : 10000); round++) {
    monkeys.forEach(monkey => {
      while (monkey.items.length) {
        let worryLevel = monkey.items.shift() as number
        worryLevel = monkey.operation.op === '*' ? worryLevel * (monkey.operation.by === 'old' ? worryLevel : Number(monkey.operation.by)) : worryLevel + (monkey.operation.by === 'old' ? worryLevel : Number(monkey.operation.by))
        // For part one we divide by three, for part 2 we need to modulo without information loss
        worryLevel = part1 ? Number(Math.floor(Number(worryLevel) / 3)) : worryLevel % modulo
        monkeys[(worryLevel % monkey.test.divisibleBy) === 0 ? monkey.test.true : monkey.test.false].items.push(worryLevel)
        monkey.inspections++
      }
    })
  }
  const [first, second] = monkeys.sort((a, b) => b.inspections - a.inspections)
  return first.inspections * second.inspections
}

console.log(`part1: ${solution(true)}`)
console.log(`part2: ${solution(false)}`)

