import { readFileSync } from 'node:fs'

/**
 * @return {number[][]}
 */
function readInput() {
  return readFileSync('./day08.data', {encoding: 'utf8'})
    .split('\n')
    .filter(l => l)
    .map(line => line.split('').map(Number))
}

/**
 *
 * @param {number[][]} treeMap
 * @return {number}
 */
function countTreesFromEdges(treeMap) {
  /*
     - We have a problem: We must count the visible trees.
     - A tree is a cell in a matrix represented by an arbitrarily large rectangular array of digits (0-9)
     - A tree is visible if its height (0-9) is higher than any other tree between it and an edge
       - We only look at rows and columns
       - A tree may be blocked from view from one side, but visible from any other side
   */

  const HEIGHT = treeMap.length
  const WIDTH = treeMap[0].length

  // Track which trees are visible. We will set a tree to true if it is visible from any edge.
  // This is not perfect, we will check every tree four times, but it's easy.
  const visibleMap = Array.from({length: HEIGHT}, () => Array.from({length: WIDTH}, () => false))

  // First we check each row, left-to-right:
  for (let row = 0; row < HEIGHT; row++) {
    let tallest = -1
    for (let col = 0; col < WIDTH; col++) {
      if (treeMap[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleMap[row][col] = true
        // Update tallest to this height
        tallest = treeMap[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  // Right-to-left:
  for (let row = 0; row < HEIGHT; row++) {
    let tallest = -1
    for (let col = HEIGHT - 1; col >= 0; col--) {
      if (treeMap[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleMap[row][col] = true
        // Update tallest to this height
        tallest = treeMap[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  // Then we check each column, top-to-bottom:
  for (let col = 0; col < WIDTH; col++) {
    let tallest = -1
    for (let row = 0; row < HEIGHT; row++) {
      if (treeMap[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleMap[row][col] = true
        // Update tallest to this height
        tallest = treeMap[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  // Bottom-to-top:
  for (let col = 0; col < WIDTH; col++) {
    let tallest = -1
    for (let row = HEIGHT - 1; row >= 0; row--) {
      if (treeMap[row][col] > tallest) {
        // This tree is taller than the tallest tree so far, it's visible!
        visibleMap[row][col] = true
        // Update tallest to this height
        tallest = treeMap[row][col]
      }
      if (tallest === 9) break // Tallest possible tree, no other tree can be taller. Abort.
    }
  }

  //Finally we count the number of visible trees:
  return visibleMap.reduce((sum, row) => sum + row.reduce((sum, height) => sum + height, 0), 0)
}

/**
 *
 * @param {number[][]} treeMap
 * @param {number} row
 * @param {number} col
 */
function getScenicScoreForPoint(treeMap, row, col) {
  const HEIGHT = treeMap.length
  const WIDTH = treeMap[0].length
  const currentHeight = treeMap[row][col]

  let visibleLeft = 0
  let visibleRight = 0
  let visibleUp = 0
  let visibleDown = 0

  for (let i = col + 1; i < WIDTH; i++) {
    visibleRight++
    if (treeMap[row][i] >= currentHeight) {
      break
    }
  }

  for (let i = col - 1; i >= 0; i--) {
    visibleLeft++
    if (treeMap[row][i] >= currentHeight) {
      break
    }
  }

  for (let i = row + 1; i < HEIGHT; i++) {
    visibleDown++
    if (treeMap[i][col] >= currentHeight) {
      break
    }
  }

  for (let i = row - 1; i >= 0; i--) {
    visibleUp++
    if (treeMap[i][col] >= currentHeight) {
      break
    }
  }

  return visibleLeft * visibleRight * visibleUp * visibleDown
}

function part1() {
  return countTreesFromEdges(readInput())
}

function part2() {
  return readInput().reduce((maxScenicValue, trees, row, treeMap) =>
      Math.max(maxScenicValue, trees.reduce((maxScenicValueForRow, tree, col) =>
        Math.max(maxScenicValueForRow, getScenicScoreForPoint(treeMap, row, col)), 0)),
    0)
}

console.log(`part1: ${part1()}`)
console.log(`part2: ${part2()}`)
