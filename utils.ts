import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs'
import * as bmpjs from 'bmp-js'

export type Tuple<A, B> = [A, B]

export function readData(day: number, splitOn: string = '\n'): string[] {
  return readFileSync(`./day${day.toFixed().padStart(2, '0')}.data`, {encoding: 'utf8'}).split(splitOn)
}

export function renderArrayToBMP(imageData: Uint8Array, width: number, height: number, name: string) {
  const data = Buffer.from(imageData)
  const image = bmpjs.encode({
    data,
    width,
    height,
  })
  if (!existsSync('./images')) mkdirSync('./images')
  writeFileSync(`./images/${name}.bmp`, image.data)
}