import {readData} from './utils'

function parseFileSystem(lines: string[]): number[] {
  const fs: Record<string, number> = {'/': 0}
  let path: string[] = []

  lines.forEach(line => {
    if (line.length === 0) return
    let data = line.match(/^(\$ ls)|(dir .+)|(\$ cd \/)$/)
    if (data) {
      // If the line is '$ ls', 'dir [dirname]' or '$ cd /' we don't need to do anything
      return
    }

    data = line.match(/^\$ cd (.*)$/)
    if (data) {
      if (data[1] === '..') {
        path.pop()
      } else {
        path.push(data[1])
      }
      return
    }

    data = line.match(/^(\d+) (.+)$/)
    if (data) {
      const size = Number(data[1])
      fs['/'] += size
      for (let i = 0; i < path.length; i++) {
        const pathString = '/' + path.slice(0, i + 1).join('/')
        fs[pathString] = (fs[pathString] ?? 0) + size
      }
    }
  })

  return Object.keys(fs).map(path => fs[path])
}

function part1(): number {
  return parseFileSystem(readData(7))
    .filter(size => size <= 100000)
    .reduce((sum, size) => sum + size, 0)
}

function part2(): number {
  const sizes = parseFileSystem(readData(7)).sort((a, b) => b - a)
  const fullFileSize = sizes[0]
  const spaceNeeded = fullFileSize - 40000000
  return sizes
    .filter((size) => size >= spaceNeeded)
    .pop() as number
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
