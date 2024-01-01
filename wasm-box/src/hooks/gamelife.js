import { useEffect, useRef, useState } from 'react'
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg.wasm'
// import * as wasm from 'wasm-game-of-life'
import { Universe, Cell } from 'wasm-game-of-life'
// import * as weerr from 'wasm-game-of-life/wasm_game_of_life_bg'
// console.log(memory)
const CELL_SIZE = 5 // px
const GRID_COLOR = '#CCCCCC'
const DEAD_COLOR = '#FFFFFF'
const ALIVE_COLOR = '#000000'

const useGameLife = () => {
  const [btnPlay, setBtnPlay] = useState(false)
  const [fpsText, setFpsText] = useState('')
  const dataRef = useRef({})

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
    // console.log(cellsPtr)
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

    ctx.beginPath()

    // for (let row = 0; row < height; row++) {
    //   for (let col = 0; col < width; col++) {
    //     const idx = getIndex(row, col)

    //     ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR

    //     ctx.fillRect(
    //       col * (CELL_SIZE + 1) + 1,
    //       row * (CELL_SIZE + 1) + 1,
    //       CELL_SIZE,
    //       CELL_SIZE
    //     )
    //   }
    // }

    ctx.fillStyle = ALIVE_COLOR
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col)
        if (cells[idx] !== Cell.Alive) {
          continue
        }

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        )
      }
    }

    // Dead cells.
    ctx.fillStyle = DEAD_COLOR
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col)
        if (cells[idx] !== Cell.Dead) {
          continue
        }

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
    fpsRender()
    // debugger
    let universe = dataRef.current.universe
    // for (let i = 0; i < 9; i++) {
    //   universe.tick()
    // }
    universe.tick()

    drawGrid()
    drawCells()
    dataRef.current.animationId = requestAnimationFrame(renderLoop)
  }

  const handleClick = () => {
    let n = !btnPlay
    if (n) {
      renderLoop()
    } else {
      cancelAnimationFrame(dataRef.current.animationId)
      dataRef.current.animationId = null
    }
    setBtnPlay((old) => {
      return !old
    })
  }

  const fpsRender = () => {
    const now = performance.now()
    const delta = now - dataRef.current.lastFrameTimeStamp
    dataRef.current.lastFrameTimeStamp = now
    const fps = (1 / delta) * 1000
    dataRef.current.frames.push(fps)
    if (dataRef.current.frames.length > 100) {
      dataRef.current.frames.shift()
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity
    let max = -Infinity
    let sum = 0
    for (let i = 0; i < dataRef.current.frames.length; i++) {
      sum += dataRef.current.frames[i]
      min = Math.min(dataRef.current.frames[i], min)
      max = Math.max(dataRef.current.frames[i], max)
    }
    let mean = sum / dataRef.current.frames.length

    let text = `
    Frames per Second:\\
             latest = ${Math.round(fps)}\\
    avg of last 100 = ${Math.round(mean)}\\
    min of last 100 = ${Math.round(min)}\\
    max of last 100 = ${Math.round(max)}
    `
    // .trim()

    setFpsText(text)
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

    dataRef.current.lastFrameTimeStamp = performance.now()
    dataRef.current.frames = []
    // console.log(pre, universe)
    // let loop =
    // requestAnimationFrame(renderLoop)
    canvas.addEventListener('click', (event) => {
      const boundingRect = canvas.getBoundingClientRect()

      const scaleX = canvas.width / boundingRect.width
      const scaleY = canvas.height / boundingRect.height

      const canvasLeft = (event.clientX - boundingRect.left) * scaleX
      const canvasTop = (event.clientY - boundingRect.top) * scaleY

      const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1)
      const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1)

      universe.toggle_cell(row, col)

      drawCells()
      drawGrid()
    })
  }, [])

  return {
    handleClick,
    btnPlay,
    fpsText,
  }
}

export default useGameLife
