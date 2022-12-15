import {Position, readData} from './utils'

enum Tile {
  EMPTY,
  SENSOR,
  BEACON,
  NOT_POSSIBLE,
}

interface Point extends Position {
  tile: Tile
  distance: number
}

function part1(lines: string[]): number {
  let xMin = 0
  let xMax = 0
  let yMin = 0
  let yMax = 0
  const points: Point[] = lines.map((line) => {
    const match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
    const Sx = Number(match[1])
    const Sy = Number(match[2])
    const Bx = Number(match[3])
    const By = Number(match[4])
    const Dx = Math.abs(Sx - Bx)
    const Dy = Math.abs(Sy - By)
    xMin = Math.min(xMin, Sx - Dx, Bx)
    xMax = Math.max(xMax, Sx + Dx, Bx)
    yMin = Math.min(yMin, Sy - Dy, By)
    yMax = Math.max(yMax, Sy + Dy, By)
    return [{x: Sx, y: Sy, tile: Tile.SENSOR, distance: Dx + Dy}, {x: Bx, y: By, tile: Tile.BEACON, distance: Dx + Dy}]
  }).flat()

  let part1 = 0
  for (let x = xMin; x <= xMax; x++) {
    const y = 2000000
    let possible = true
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const Py = point.y
      const Px = point.x - (xMin - 1)
      const Dy = Math.abs(Py - y)
      const Dx = Math.abs(Px - (x - (xMin - 1)))

      if (y === Py && x === Px) {
        possible = point.tile === Tile.BEACON
        break
      }

      if (point.tile !== Tile.SENSOR) continue

      if (Dy + Dx <= point.distance) {
        possible = false
      }
    }
    if (!possible) part1++
  }

  return part1
}

function part2(lines: string[]): number {
  const points: Point[] = lines.map((line) => {
    const match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
    const Sx = Number(match[1])
    const Sy = Number(match[2])
    const Bx = Number(match[3])
    const By = Number(match[4])
    const Dx = Math.abs(Sx - Bx)
    const Dy = Math.abs(Sy - By)
    return {x: Sx, y: Sy, tile: Tile.SENSOR, distance: Dx + Dy}
  })

  const MAX = 4000000

  function findSensor(y: number, x: number): boolean {
    if (y < 0 || y > MAX || x < 0 || x > MAX) return true
    return !!points.find(point => Math.abs(y - point.y) + Math.abs(x - point.x) <= point.distance)
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    for (let x = point.x, y = point.y - point.distance - 1; y <= point.y; x++, y++) {
      if (!findSensor(y, x)) return x * 4000000 + y
    }
    for (let x = point.x, y = point.y + point.distance + 1; y >= point.y; x++, y--) {
      if (!findSensor(y, x)) return x * 4000000 + y
    }
    for (let x = point.x, y = point.y - point.distance - 1; y <= point.y; x--, y++) {
      if (!findSensor(y, x)) return x * 4000000 + y
    }
    for (let x = point.x, y = point.y + point.distance + 1; y >= point.y; x--, y--) {
      if (!findSensor(y, x)) return x * 4000000 + y
    }
  }
  return -1
}


console.log('Part 1:', part1(readData(15).filter(f => f)))
console.log('Part 2:', part2(readData(15).filter(f => f)))
