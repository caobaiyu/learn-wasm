(module
  (import "env" "print" (func $js_print (param i32 i32)))
  (import "env" "memory" (memory $memory 1))
  (import "env" "table" (table  $t 2 funcref))
  (type $type_0 (func (param i32 i32)))
  (elem (i32.const 0) $hello )
  (data (i32.const 0) "你好,wasm")
  (func $hello
    i32.const 0
    i32.const 17
    call $js_print
  )
  (export "table" (table  $t))   
)