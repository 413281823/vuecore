// 收集副作用函数逻辑抽离

const obj = new Proxy(data, {
    // 拦截读取操作
    get(target,key){
        // 将副作用函数 activeEffect 添加到存储副作用函数的🪣中
        track(target, key)
        // 返回属性值
        return target[key]
    },
    // 拦截set操作
    set(target,key,newVal){
        //设置属性值
        target[key] = newVal
        // 把副作用函数从🪣中取出并执行
        trigger(target, key)
    }
})

// 在get拦截函数内调用track函数追踪变化

function track(target, key) {
    // 没有activeEffect, 直接return
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target,(deps = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

// 在set拦截函数内调用trigger函数触发变化

function trigger(target,key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}