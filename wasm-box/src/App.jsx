import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { wasmExports, wasmImport, wasmTable } from '@/utils/load.js'
import './App.css'
import useGameLife from './hooks/gamelife'
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg.wasm'
// import * as wasm from 'wasm-game-of-life'
import { Universe, Cell } from 'wasm-game-of-life'
// import * as weerr from 'wasm-game-of-life/wasm_game_of_life_bg'
// console.log(memory)

function App() {
  // webpack导入wasm
  const { handleClick, btnPlay, fpsText } = useGameLife()
  // 导出
  // wasmExports()
  // 导入
  wasmImport()
  // wasmTable()

  return (
    <>
      <h1>Vite + React</h1>
      <h2 id="wasmShow"></h2>
      <div className="canvas_top">
        <div>
          {fpsText.split('\\').map((v, i) => {
            return <span key={i}>{v}</span>
          })}
        </div>
        <div>
          <button onClick={handleClick}>{btnPlay ? '⏸' : '▶'}</button>
        </div>
      </div>
      <br />
      <br />
      <canvas id="game-of-life-canvas"></canvas>
    </>
  )
}

export default App
