(module
  (memory $mem 1 8)
  (data (i32.const 0) "你好,wasm")
  (table $tab 1 20 funcref)
  (elem (i32.const 0) $add )
  (global $g1 (mut i32) (i32.const 99))
  (type $type_0 (func (param i32 i32) (result i32)))
  (func $add (type $type_0)
    local.get 0
    local.get 1
    i32.add
  )
  (func $call_by_index (type $type_0)
    local.get 0
    local.get 1
    i32.const 0
    (call_indirect (type $type_0))
  )
  (func (export "sub1") (param $i1 i32) (result i32)
    (i32.sub  (local.get $i1) (i32.const 1))
  )
  (func $sub2 (param $i1 i32) (result i32)
    local.get $i1
    i32.const 2
    i32.sub
  )
  (export "sub2" (func $sub2))
  (export "call_by_index" (func $call_by_index))
  (export "table" (table $tab))   
  (export "memory" (memory $mem))
)