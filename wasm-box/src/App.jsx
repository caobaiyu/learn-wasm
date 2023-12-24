import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { wasmExports, wasmImport, wasmTable } from '@/utils/load.js'
import './App.css'
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg.wasm'
// import * as wasm from 'wasm-game-of-life'
import { Universe, Cell } from 'wasm-game-of-life'
// import * as weerr from 'wasm-game-of-life/wasm_game_of_life_bg'
console.log(memory)
const CELL_SIZE = 5 // px
const GRID_COLOR = '#CCCCCC'
const DEAD_COLOR = '#FFFFFF'
const ALIVE_COLOR = '#000000'

function App() {
  const dataRef = useRef({})
  // wasmExports()
  // wasmImport()
  // wasmTable()
  // wasm.greet()

  const drawGrid = () => {
    const ctx = dataRef.current.canvasCtx
    const height = dataRef.current.canvasHeight
    const width = dataRef.current.canvasWidth
    ctx.beginPath()
    ctx.lineWidth = 1 / window.devicePixelRatio
    ctx.strokeStyle = GRID_COLOR

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0)
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1)
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1)
    }

    ctx.stroke()
  }
  const getIndex = (row, column) => {
    const height = dataRef.current.canvasHeight
    const width = dataRef.current.canvasWidth
    return row * width + column
  }

  const drawCells = () => {
    const universe = dataRef.current.universe
    const ctx = dataRef.current.canvasCtx
    // canvasWidth canvasHeight
    const height = dataRef.current.canvasHeight
    const width = dataRef.current.canvasWidth
    const cellsPtr = universe.cells() // < universe's cells
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

    ctx.beginPath()

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col)

        ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        )
      }
    }

    ctx.stroke()
  }
  const renderLoop = () => {
    let universe = dataRef.current.universe
    universe.tick()

    drawGrid()
    drawCells()

    requestAnimationFrame(renderLoop)
  }
  useEffect(() => {
    const universe = Universe.new()
    const width = universe.width()
    const height = universe.height()
    const canvas = document.getElementById('game-of-life-canvas')
    canvas.height = (CELL_SIZE + 1) * height + 1
    canvas.width = (CELL_SIZE + 1) * width + 1

    const ctx = canvas.getContext('2d')

    dataRef.current.universe = universe
    dataRef.current.canvasDom = canvas
    dataRef.current.canvasCtx = ctx
    dataRef.current.canvasWidth = width
    dataRef.current.canvasHeight = height
    // console.log(pre, universe)
    // let loop =
    requestAnimationFrame(renderLoop)
  }, [])
  return (
    <>
      <h1>Vite + React</h1>
      <h2 id="wasmShow"></h2>
      <canvas id="game-of-life-canvas"></canvas>
    </>
  )
}

export default App
