import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { wasmExports, wasmImport, wasmTable } from '@/utils/load.js'
import './App.css'

function App() {
  // wasmExports()
  // wasmImport()
  wasmTable()
  // let wasmMen = new WebAssembly.Memory({ initial: 1 })
  // const printStr = (offset, length) => {
  //   let bytes = new Uint8Array(wasmMen.buffer, offset, length)
  //   let string = new TextDecoder("utf8").decode(bytes)
  //   console.log(string)
  // }
  // let obj = {
  //   js: { print: printStr, mem: wasmMen },
  // }
  // fetch('/public/wasm/hello.wasm')
  //   .then((res) => res.arrayBuffer())
  //   .then((bytes) => WebAssembly.instantiate(bytes, obj))
  //   .then((result) => {
  //     result.instance.exports.hello()
  //   })
  return (
    <>
      <h1>Vite + React</h1>
      <h2 id='wasmShow'></h2>
    </>
  )
}

export default App
