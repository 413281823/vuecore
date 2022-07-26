// 用一个全局变量存储被注册的副作用函数
let activeEffect
// 存储副作用函数的桶
const bucket = new Set();

//原始数据
const data = {text: 'hello world'};
function effect(fn) {
    // 当调用effect注册副作用函数时， 将副作用函数 fn 赋值给activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}
// 对原始数据的代理
const obj = new Proxy(data, {
    // 拦截读取操作
    get (target, key) {
        // 将副作用函数 effect 添加到存储副作用函数的桶中
        if (activeEffect) {
            bucket.add(activeEffect)
        }
        // 返回属性值
        return target[key]
    },
    // 设置拦截操作
    set (target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶里取出并执行
        bucket.forEach(fn => fn())
        // 返回true代表设置操作成功
    }
})

effect(() => {
    console.log('effect run')
})