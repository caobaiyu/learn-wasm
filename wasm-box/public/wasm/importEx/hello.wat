(module
  (import "env" "console" (func $js_print (param i32 )))
  (import "env" "memory" (memory $memory 1))
  (import "env" "table" (table  $t 2 funcref))
  (type $type_0 (func))
  (func (export "hello") 
    i32.const 0
    (call_indirect (type $type_0))
  )
  ;; (func (export "logAdd") 
  ;;   i32.const 12
  ;;   ;; i32.const 13
  ;;   ;; i32.add
  ;;   call $js_print
  ;; )
  (func $add (param i32 i32) 
    local.get 0
    local.get 1
    i32.add
    call $js_print
  )
   (export "add" (func $add))
)