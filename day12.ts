import {Position, readData, renderArrayToBMP} from './utils'

interface MapPoint {
  x: number
  y: number
  z: number,
  distance: number
  closestToPeak: MapPoint | null
}

function parseMap(lines: string[]): [MapPoint[][], Position, Position] {
  const start: Position = {x: 0, y: 0}
  const end: Position = {x: 0, y: 0}
  const map: MapPoint[][] = lines.map((line, y) => line
    .split('')
    .map((letter, x) => {
      if (letter === 'S') {
        start.x = x
        start.y = y
        return {
          x,
          y,
          z: 0,
          distance: 9999,
          closestToPeak: null,
        }
      }
      if (letter === 'E') {
        end.x = x
        end.y = y
        return {
          x,
          y,
          z: 'z'.charCodeAt(0) - 'a'.charCodeAt(0),
          distance: 9999,
          closestToPeak: null,
        }
      }
      return {
        x,
        y,
        z: letter.charCodeAt(0) - 'a'.charCodeAt(0),
        distance: 9999,
        closestToPeak: null,
      }
    }))
  return [map, start, end]
}

function findShortestRoute(map: MapPoint[][], start: Position, end: Position) {
  calculateSteps(map, end, null, 0)

  console.log('Part 1:',map[start.y][start.x].distance)

  const closestLowestPoint = map
    .reduce((all, row) => all.concat(row), [] as MapPoint[])
    .filter(p => p.z === 0)
    .sort((a, b) => a.distance - b.distance)[0]

  console.log('Part 2:',closestLowestPoint.distance)

  // Rest are only for GFX
  const pathFromStart = pathToPeak(map[start.y][start.x])
  const shortestPath = pathToPeak(closestLowestPoint)

  heightMapToBitMap(map, start, end, pathFromStart, shortestPath)
}

function pathToPeak(point: MapPoint): Position[] {
  return point.closestToPeak ? [{y: point.y, x: point.x}, ...pathToPeak(point.closestToPeak)] : [{y: point.y, x: point.x}]
}

function calculateSteps(map: MapPoint[][], {y, x}: Position, previous: MapPoint | null, steps: number) {
  const currentPoint: MapPoint = map[y][x]
  if (currentPoint.distance <= steps) {
    return null
  }

  currentPoint.distance = steps
  currentPoint.closestToPeak = previous

  if (y > 0 && map[y - 1][x].z >= (currentPoint.z - 1)) {
    calculateSteps(map, {x, y: y - 1}, currentPoint, steps + 1)
  }
  if (y < (map.length - 1) && map[y + 1][x].z >= (currentPoint.z - 1)) {
    calculateSteps(map, {x, y: y + 1}, currentPoint, steps + 1)
  }
  if (x > 0 && map[y][x - 1].z >= (currentPoint.z - 1)) {
    calculateSteps(map, {x: x - 1, y}, currentPoint, steps + 1)
  }
  if (x < (map[0].length - 1) && map[y][x + 1].z >= (currentPoint.z - 1)) {
    calculateSteps(map, {x: x + 1, y}, currentPoint, steps + 1)
  }
}

function solution() {
  const [map, start, end] = parseMap(readData(12).filter(f => f))
  findShortestRoute(map, start, end)
}

solution()

function heightMapToBitMap(map: MapPoint[][], start: Position, end: Position, pathFromStart: Position[], shortestPath: Position[]) {
  const HEIGHT = map.length
  const WIDTH = map[0].length
  const imageData = new Uint8Array(Array.from({length: WIDTH * HEIGHT * 4}, () => 255))
  map.forEach((row, y) => row.forEach((point, x) => {
    const index = y * 4 * WIDTH + x * 4
    imageData[index + 1] = (point.z / 26) * 255
    imageData[index + 2] = (point.z / 26) * 192 + 64
    imageData[index + 3] = (point.z / 26) * 255
  }))

  pathFromStart.forEach(point => {
    const index = point.y * 4 * WIDTH + point.x * 4
    imageData[index + 1] = 255
    imageData[index + 2] = 0
    imageData[index + 3] = 0
  })

  shortestPath.forEach(point => {
    const index = point.y * 4 * WIDTH + point.x * 4
    imageData[index + 1] = 0
    imageData[index + 2] = 255
    imageData[index + 3] = 255
  })

  const startIndex = start.y * 4 * WIDTH + start.x * 4
  imageData[startIndex + 1] = 0
  imageData[startIndex + 2] = 255
  imageData[startIndex + 3] = 0

  const endIndex = end.y * 4 * WIDTH + end.x * 4
  imageData[endIndex + 1] = 0
  imageData[endIndex + 2] = 0
  imageData[endIndex + 3] = 255

  renderArrayToBMP(imageData, WIDTH, HEIGHT, `day12_height`)
}