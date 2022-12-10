import {readData, renderArrayToBMP} from './utils'

function solution(): number {
  let cycle = 0
  let signalStrength = 1
  let signalSum = 0
  const gfx: boolean[] = [false]

  readData(10, /\n|\s/)
    .filter(f => f)
    .forEach(value => {
      cycle++

      // Part 1
      if ((cycle - 20) % 40 === 0) {
        signalSum += signalStrength * cycle
      }

      // Part 2
      const diff = (cycle - 1) % 40 - (signalStrength - 1)
      gfx.push(diff >= 0 && diff < 3)

      if (value !== 'noop' && value !== 'addx') {
        signalStrength += Number(value)
      }
    })

  renderScreen(gfx)
  return signalSum
}

console.log(`part1: ${solution()}`)
console.log(`See ./images/day10.bmp`)

function renderScreen(pixels: boolean[]) {
  const WIDTH = 40
  const HEIGHT = 6
  const imageData = new Uint8Array(Array.from({length: WIDTH * HEIGHT * 4}, () => 255))
  pixels.forEach((isOn, index) => {
    imageData[index * 4] = 255
    imageData[index * 4 + 1] = (isOn ? 0 : 1) * 255
    imageData[index * 4 + 2] = (isOn ? 0 : 1) * 255
    imageData[index * 4 + 3] = (isOn ? 0 : 1) * 255
  })
  renderArrayToBMP(imageData, WIDTH, HEIGHT, `day10`)
}