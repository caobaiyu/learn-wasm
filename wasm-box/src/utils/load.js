import { fetchAndInstantiate, fetchAndInstantiateStreaming } from './index'

const showString = (buffer, offset, length) => {
  let bytes = new Uint8Array(buffer, offset, length)
  let string = new TextDecoder('utf8').decode(bytes)
  return string
}

export const wasmExports = async () => {
  try {
    let instance = await fetchAndInstantiateStreaming(
      '/public/wasm/exportEx/index.wasm'
    )
    let { sub1, sub2, call_by_index, memory, table } = instance.exports

    console.log(instance)
    // 调用函数
    console.log('call_by_index(6,7):', call_by_index(6, 7))
    console.log('sub1(5):', sub1(5))
    console.log('sub2(5):', sub2(5))
    console.log('sub2(4):', sub2(4))
    // 通过table间接调用
    console.log('table.get(0)(1, 2):', table.get(0)(1, 2))
    // 使用内存数据
    console.log('showString:', showString(memory.buffer, 0, 11))
    // js 在内存中写入数据
    let bytes = new Uint8Array(memory.buffer, 7, 8)
    const textEncoder = new TextEncoder()
    '我是js'
      .split('')
      .map((v, i) => {
        return textEncoder.encode(v)
      })
      .reduce((acc, v) => {
        acc.push(...v)
        return acc
      }, [])
      .forEach((v, i) => {
        bytes[i] = v
      })
    console.log('写入后showString:', showString(memory.buffer, 0, 15))
  } catch (error) {
    console.log('=-0099')
  }
}

const h2Show = (buffer, offset, length) => {
  let str = showString(buffer, offset, length)
  let dom = document.getElementById('wasmShow')
  dom.innerHTML = str
}

const printStr = (buffer, offset, length) => {
  let str = showString(buffer, offset, length)
  console.log(str)
}

export const wasmImport = async () => {
  let memory = new WebAssembly.Memory({ initial: 1 })
  let table = new WebAssembly.Table({ initial: 2, element: 'anyfunc' })
  let importObj = {
    env: {
      console: (...args) => {
        console.log(args)
      },
      // console: console.log,
      memory,
      table,
    },
  }
  try {
    let instance = await fetchAndInstantiateStreaming(
      '/public/wasm/importEx/hello.wasm',
      importObj
    )
    let { add, ws_log } = instance.exports

    console.log('==>>>instance', instance)
    // 调用函数
    add(3, 5)
    ws_log()
  } catch (error) {}
}

export const wasmTable = async () => {
  let memory = new WebAssembly.Memory({ initial: 1 })
  let table = new WebAssembly.Table({ initial: 2, element: 'anyfunc' })
  // 设置内存数据
  let bytes = new Uint8Array(memory.buffer, 13, 4)
  const textEncoder = new TextEncoder()
  ',hhh'.split('').forEach((v, i) => {
    bytes[i] = textEncoder.encode(v)
  })

  function docH2(offset, length) {
    console.log(offset, length)
    h2Show(memory.buffer, offset, length)
  }

  let importTableObj = {
    env: {
      print: docH2,
      memory,
      table,
    },
  }
  try {
    // fetchAndInstantiate
    // let tableInstance = await fetchAndInstantiateStreaming(
    let tableInstance = await fetchAndInstantiateStreaming(
      '/public/wasm/importEx/table.wasm',
      importTableObj
    )
    console.log('==>>>', tableInstance)
    let importObj = {
      env: {
        console: console.log,
        memory,
        table: tableInstance.exports.table,
        // table,
      },
    }

    let instance = await fetchAndInstantiateStreaming(
      '/public/wasm/importEx/hello.wasm',
      importObj
    )
    let { hello } = instance.exports
    // printStr(memory.buffer, 0, 18)
    // console.log('memory中数据', );

    // 调用函数
    hello()
  } catch (error) {
    console.log(error)
  }
}
