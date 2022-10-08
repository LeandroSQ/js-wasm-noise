(module
 (type $none_=>_f64 (func (result f64)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (import "env" "memory" (memory $0 1))
 (import "env" "seed" (func $~lib/builtins/seed (result f64)))
 (global $~lib/math/random_seeded (mut i32) (i32.const 0))
 (global $~lib/math/random_state0_64 (mut i64) (i64.const 0))
 (global $~lib/math/random_state1_64 (mut i64) (i64.const 0))
 (export "render" (func $src/assembly/index/render))
 (export "memory" (memory $0))
 (func $src/assembly/index/render (param $0 i32) (param $1 i32)
  (local $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i64)
  loop $for-loop|0
   local.get $1
   local.get $4
   i32.gt_s
   if
    i32.const 0
    local.set $3
    loop $for-loop|1
     local.get $0
     local.get $3
     i32.gt_s
     if
      global.get $~lib/math/random_seeded
      i32.eqz
      if
       call $~lib/builtins/seed
       i64.reinterpret_f64
       local.tee $2
       i64.eqz
       if
        i64.const -7046029254386353131
        local.set $2
       end
       local.get $2
       local.get $2
       i64.const 33
       i64.shr_u
       i64.xor
       i64.const -49064778989728563
       i64.mul
       local.tee $2
       i64.const 33
       i64.shr_u
       local.get $2
       i64.xor
       i64.const -4265267296055464877
       i64.mul
       local.tee $2
       i64.const 33
       i64.shr_u
       local.get $2
       i64.xor
       global.set $~lib/math/random_state0_64
       global.get $~lib/math/random_state0_64
       i64.const -1
       i64.xor
       local.tee $2
       i64.const 33
       i64.shr_u
       local.get $2
       i64.xor
       i64.const -49064778989728563
       i64.mul
       local.tee $2
       i64.const 33
       i64.shr_u
       local.get $2
       i64.xor
       i64.const -4265267296055464877
       i64.mul
       local.tee $2
       i64.const 33
       i64.shr_u
       local.get $2
       i64.xor
       global.set $~lib/math/random_state1_64
       i32.const 1
       global.set $~lib/math/random_seeded
      end
      global.get $~lib/math/random_state0_64
      local.set $7
      global.get $~lib/math/random_state1_64
      local.tee $2
      global.set $~lib/math/random_state0_64
      local.get $2
      local.get $7
      local.get $7
      i64.const 23
      i64.shl
      i64.xor
      local.tee $7
      i64.const 17
      i64.shr_u
      local.get $7
      i64.xor
      i64.xor
      local.get $2
      i64.const 26
      i64.shr_u
      i64.xor
      global.set $~lib/math/random_state1_64
      local.get $0
      local.get $4
      i32.mul
      local.get $3
      i32.add
      i32.const 2
      i32.shl
      local.tee $5
      i32.const 255
      i32.const 0
      local.get $2
      i64.const 12
      i64.shr_u
      i64.const 4607182418800017408
      i64.or
      f64.reinterpret_i64
      f64.const -1
      f64.add
      f64.const 0.5
      f64.le
      select
      local.tee $6
      i32.store8 $0
      local.get $5
      i32.const 1
      i32.add
      local.get $6
      i32.store8 $0
      local.get $5
      i32.const 2
      i32.add
      local.get $6
      i32.store8 $0
      local.get $5
      i32.const 3
      i32.add
      i32.const 255
      i32.store8 $0
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
 )
)
