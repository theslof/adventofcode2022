import {Position, readData, renderArrayToBMP, Tuple} from './utils'

type Direction = 'D' | 'U' | 'L' | 'R'

function parseMove(line: string): Tuple<Direction, number> {
  const [d, n] = line.split(' ')
  return [d as Direction, Number(n)]
}

function solution(): Tuple<number, number> {
  const moves = readData(9).filter(f => f).map(parseMove)
  const rope: Position[] = Array.from({length: 10}, () => ({x: 0, y: 0}))
  const headCoordinates: Position[] = [{x: 0, y: 0}]
  const knot1Coordinates: Position[] = [{x: 0, y: 0}]
  const knot9Coordinates: Position[] = [{x: 0, y: 0}]
  const max = {
    xmin: 0,
    xmax: 0,
    ymin: 0,
    ymax: 0,
  }

  moves.forEach(move => {
    for (let n = 0; n < move[1]; n++) {
      // Move the first knot
      switch (move[0]) {
        case 'D':
          rope[0].y -= 1
          break
        case 'U':
          rope[0].y += 1
          break
        case 'R':
          rope[0].x += 1
          break
        case 'L':
          rope[0].x -= 1
          break
      }

      // Tracking these for image rendering purposes
      max.xmin = Math.min(max.xmin, rope[0].x)
      max.xmax = Math.max(max.xmax, rope[0].x)
      max.ymin = Math.min(max.ymin, rope[0].y)
      max.ymax = Math.max(max.ymax, rope[0].y)

      // For every other knot, move them relative to the knot in front of them
      for (let knot = 1; knot < rope.length; knot++) {
        const head = rope[knot - 1]
        const tail = rope[knot]
        const distance = Math.max(
          Math.abs(head.x - tail.x),
          Math.abs(head.y - tail.y),
        )

        // We only move a knot if the distance between it and the one in front is more than two steps:
        if (distance > 1) {
          if (head.x > tail.x) tail.x++
          if (head.x < tail.x) tail.x--
          if (head.y > tail.y) tail.y++
          if (head.y < tail.y) tail.y--
        } else {
          break
        }
      }
      // Save each coordinate so that we can draw fancy images
      // Solution only requires us to save unique coordinates
      headCoordinates.push({...rope[0]})
      knot1Coordinates.push({...rope[1]})
      knot9Coordinates.push({...rope[9]})
    }
  })

  // Generate fancy images
  renderCoordinates(headCoordinates, max, 'head')
  renderCoordinates(knot1Coordinates, max, 'knot1')
  renderCoordinates(knot9Coordinates, max, 'knot9')

  return [new Set(knot1Coordinates.map(c => `${c.x},${c.y}`)).size, new Set(knot9Coordinates.map(c => `${c.x},${c.y}`)).size]
}

const [part1, part2] = solution()
console.log(`part1: ${part1}`)
console.log(`part2: ${part2}`)

function renderCoordinates(coordinates: Position[], maximums: { xmin: number, xmax: number, ymin: number, ymax: number }, name: string) {
  const WIDTH = maximums.xmax - maximums.xmin + 1
  const HEIGHT = maximums.ymax - maximums.ymin + 1
  const imageData = new Uint8Array(Array.from({length: WIDTH * HEIGHT * 4}, () => 0))
  coordinates.forEach((point, i) => {
    const index = (HEIGHT - point.y + maximums.ymin - 1) * WIDTH * 4 + (point.x - maximums.xmin) * 4
    imageData[index] = 255
    imageData[index + 1] = 0
    imageData[index + 2] = (i / coordinates.length) * 255 // Green
    imageData[index + 3] = (1 - (i / coordinates.length)) * 255 // Red
  })
  renderArrayToBMP(imageData, WIDTH, HEIGHT, `day09_${name}`)
}