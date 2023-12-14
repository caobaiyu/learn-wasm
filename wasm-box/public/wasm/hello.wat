(module
  (import "js" "print" (func $js_print (param i32 i32 )))
  (import "js" "mem" (memory 1))
  (data (i32.const 0) "你好,wasm")
  (data (i32.const 13) "你是,wasm")
  (func (export "hello") 
    i32.const 0
    i32.const 13
    call $js_print
    i32.const 13
    i32.const 13
    call $js_print
  )
)