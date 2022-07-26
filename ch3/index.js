// 存储副作用函数的容器
const bucket = new WeakMap()

//WeakMap target 对象obj
  // Map text obj的key
    // Set effectFn 这个key的副作用函数

const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 没有 activeEffect，表示没有注册副作用函数 直接return
        if(!activeEffect) return
        // 根据target 从 “🪣” 中取得depsMap, 他也是一个Map类型：Key --> effects
        let depsMap = bucket.get(target)
        // 如果不存在depsMap, 那么新建一个Map并与target关联
        if (!depsMap) {
            bucket.set(target, (depsMap = new Map()))
        }
        // 再根据key从depsMap中取得deps，它是一个Set类型
        // 里面存储着所有与当前key关联的副作用函数：effect；
        let deps = depsMap.get(key)
        // 如果deps不存在， 同样新建一个Set并与key关联
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        // 最后将当前激活的副作用函数添加到“🪣”里
        deps.add(activeEffect)
        // 返回属性值
        return target[key]
    }
})