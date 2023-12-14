export const fetchAndInstantiate = async (url, importObj = {}) => {
  try {
    // 请求下载WebAssembly文件
    let response = await fetch(url)
    // 请求将文件数据转化为一个 ArrayBuffer
    // Blob 接口的 arrayBuffer() 方法返回一个 Promise，其会兑现一个包含 blob 二进制数据内容的 ArrayBuffer。
    let bytes = await response.arrayBuffer()
    // 向函数instantiate传入这个ArrayBuffer
    // WebAssembly.instantiate() 允许你编译和实例化 WebAssembly 代码。
    let result = await WebAssembly.instantiate(bytes, importObj)
    return result.instance
  } catch (error) {}
}

export const fetchAndInstantiateStreaming = async (url, importObj = {}) => {
  try {
    // WebAssembly.instantiateStreaming() 函数直接从流式底层源编译并实例化 WebAssembly 模块。这是加载 Wasm 代码的最有效、最优化的方式。
    let result = await WebAssembly.instantiateStreaming(fetch(url), importObj)
    return result.instance
  } catch (error) {
    console.log('StreamError', error);
  }
}
