import {Position, readData, renderArrayToBMP} from './utils'

enum Tile {
  EMPTY,
  PATH,
  WALL,
  SAND,
}

function parseMap(lines: string[]): Tile[][] {
  let HEIGHT = 0
  const walls = lines.map(line => line
    .split(' -> ')
    .map(coordinate => coordinate.split(','))
    .map(([x, y]): Position => {
      HEIGHT = Math.max(HEIGHT, Number(y) + 1)
      return {x: Number(x), y: Number(y)}
    }))
  const map: Tile[][] = Array.from({length: HEIGHT + 1}, () => Array.from({length: HEIGHT * 2 + 1}, () => Tile.EMPTY))
  walls.forEach(wall => {
    for (let i = 0; i < wall.length - 1; i++) {
      const start = wall[i]
      const end = wall[i + 1]
      if (start.x !== end.x) {
        for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
          map[start.y][Math.floor(x - 500 + HEIGHT)] = Tile.WALL
        }
      }
      if (start.y !== end.y) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
          map[y][Math.floor(start.x - 500 + HEIGHT)] = Tile.WALL
        }
      }
    }
  })

  return map
}

function fillSand(map: Tile[][]) {
  let keepGoing = true
  while (keepGoing) {
    keepGoing = false
    let x = Math.floor(map[0].length / 2)
    for (let y = 0; y < map.length - 1; y++) {
      if (map[y][x] === Tile.SAND || map[y][x] === Tile.WALL) break
      map[y][x] = Tile.PATH
      const [left, middle, right] = map[y + 1].slice(x - 1, x + 2)
      if (middle === Tile.EMPTY || middle === Tile.PATH) {
        continue
      }
      if (left === Tile.EMPTY || left === Tile.PATH) {
        x--
        continue
      }
      if (right === Tile.EMPTY || right === Tile.PATH) {
        x++
        continue
      }
      map[y][x] = Tile.SAND
      keepGoing = true
    }
    if (map[0][Math.floor(map[0].length / 2)] === Tile.SAND) keepGoing = false
  }
}

function part1() {
  const map = parseMap(readData(14).filter(f => f))
  fillSand(map)
  mapToBitMap(map)
  return map.flat().reduce((sum, tile) => tile === Tile.SAND ? sum + 1 : sum, 0)
}

function part2() {
  const map = parseMap(readData(14).filter(f => f))
  map.push(Array.from({length: map[0].length}, () => Tile.WALL))
  fillSand(map)
  mapToBitMap(map, 2)
  return map.flat().reduce((sum, tile) => tile === Tile.SAND ? sum + 1 : sum, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())

function mapToBitMap(map: Tile[][], part = 1) {
  const HEIGHT = map.length
  const WIDTH = map[0].length
  const imageData = new Uint8Array(Array.from({length: WIDTH * HEIGHT * 4}, () => 255))

  map.flat().forEach((tile, index) => {
    imageData[index * 4 + 1] = 0
    imageData[index * 4 + 2] = (tile === Tile.SAND || tile === Tile.PATH ? 1 : 0) * 255
    imageData[index * 4 + 3] = (tile === Tile.SAND || tile === Tile.WALL ? 1 : 0) * 255
  })

  renderArrayToBMP(imageData, WIDTH, HEIGHT, `day14_${part}`)
}
