import {readData, renderArrayToBMP} from './utils'

const data = readData(8).map(line => line.split('').map(Number))
const HEIGHT = data.length
const WIDTH = data[0].length
const visibleData = calculateTreesVisibleFromEdges()
const scenicScoreData = calculateScenicScores()

function calculateTreesVisibleFromEdges(): number[] {
  /*
     - We have a problem: We must count the visible trees.
     - A tree is a cell in a matrix represented by an arbitrarily large rectangular array of digits (0-9)
     - A tree is visible if its height (0-9) is higher than any other tree between it and an edge
       - We only look at rows and columns
       - A tree may be blocked from view from one side, but visible from any other side
   */

  // Track which trees are visible. We will set a tree to true if it is visible from any edge.
  // This is not perfect, we will check every tree four times, but it's easy.
  const visibleTrees = new Array(WIDTH * HEIGHT)

  // First we check each row
  for (let row = 0; row < HEIGHT; row++) {
    // Left-to-right:
    let tallest = -1
    for (let col = 0; col < WIDTH; col++) {
      if (data[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleTrees[row * WIDTH + col] = true
        // Update tallest to this height
        tallest = data[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }

    // Right-to-left:
    tallest = -1
    for (let col = HEIGHT - 1; col >= 0; col--) {
      if (data[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleTrees[row * WIDTH + col] = true
        // Update tallest to this height
        tallest = data[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  // Then we check each column
  for (let col = 0; col < WIDTH; col++) {
    // Top-to-bottom:
    let tallest = -1
    for (let row = 0; row < HEIGHT; row++) {
      if (data[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleTrees[row * WIDTH + col] = true
        // Update tallest to this height
        tallest = data[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }

    // Bottom-to-top
    tallest = -1
    for (let row = HEIGHT - 1; row >= 0; row--) {
      if (data[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleTrees[row * WIDTH + col] = true
        // Update tallest to this height
        tallest = data[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  return visibleTrees
}

function calculateScenicScores(): number[] {
  const scenicScores = new Array(WIDTH * HEIGHT)

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const currentHeight = data[row][col]

      let visibleLeft = 0
      let visibleRight = 0
      let visibleUp = 0
      let visibleDown = 0

      for (let i = col + 1; i < WIDTH; i++) {
        visibleRight++
        if (data[row][i] >= currentHeight) break
      }

      for (let i = col - 1; i >= 0; i--) {
        visibleLeft++
        if (data[row][i] >= currentHeight) break
      }

      for (let i = row + 1; i < HEIGHT; i++) {
        visibleDown++
        if (data[i][col] >= currentHeight) break
      }

      for (let i = row - 1; i >= 0; i--) {
        visibleUp++
        if (data[i][col] >= currentHeight) break
      }

      scenicScores[row * WIDTH + col] = visibleLeft * visibleRight * visibleUp * visibleDown
    }
  }
  return scenicScores
}

function part1(): number {
  //Finally we count the number of visible trees:
  return visibleData.reduce((sum, visible) => sum + visible, 0)
}

function part2(): number {
  return Math.max(...scenicScoreData)
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)

renderImages()

function renderImages() {
  renderHeightToBMP()
  renderVisibleToBMP()
  renderScenicScoreToBMP()
}

function renderVisibleToBMP() {
  const imageData = new Uint8Array(WIDTH * HEIGHT * 4)
  visibleData.forEach((visible, index) => {
    imageData[index * 4] = 255
    imageData[index * 4 + 1] = visible * 255
    imageData[index * 4 + 2] = visible * 255
    imageData[index * 4 + 3] = visible * 255
  })
  renderArrayToBMP(imageData, WIDTH, HEIGHT, 'day08_visible')
}

function renderScenicScoreToBMP() {
  const maxScenicScore = part2()
  const imageData = new Uint8Array(WIDTH * HEIGHT * 4)
  scenicScoreData.forEach((score, index) => {
    const logScore = Math.log10(score / maxScenicScore * 10)
    imageData[index * 4] = 255
    imageData[index * 4 + 1] = logScore * 255 // Blue
    imageData[index * 4 + 2] = logScore * 255 // Green
    imageData[index * 4 + 3] = logScore * 255 // Red
  })

  renderArrayToBMP(imageData, WIDTH, HEIGHT, 'day08_scenic')
}

function renderHeightToBMP() {
  const imageData = new Uint8Array(WIDTH * HEIGHT * 4)
  data.forEach((row, y) => row.forEach((height, x) => {
    const pos = y * WIDTH * 4 + x * 4
    imageData[pos] = 255
    imageData[pos + 1] = 0 // Blue
    imageData[pos + 2] = height / 9 * 255 // Green
    imageData[pos + 3] = 0 // Red
  }))
  renderArrayToBMP(imageData, WIDTH, HEIGHT, 'day08_height')
}
