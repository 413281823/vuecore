// 虚拟dom
const MyComponent = function (){
    return {
        tag: 'div',
        props: {
            onClick: () => alert('hello')
        },
        children: 'click me'
    }
}
const vnode = {
    tag:MyComponent,
}

function mountElement(vnode, container) {
    // 使用vnode.tag 作为标签名称创建dom元素
    const el = document.createElement(vnode.tag)
    // 遍历 vnode.props， 将属性、事件添加到dom元素
    for (const key in vnode.props) {
        if (/^on/.test(key)) {
             // 如果key 以on 开头，说明它是事件
             el.addEventListener(
                key.substr(2).toLowerCase(),
                vnode.props[key]// 事件处理函数
             )
        }
    }
    // 处理children
    if (typeof vnode.children === 'string'){
        // 如果children是字符串，说明它是元素的文本子节点
        el.appendChild(document.createTextNode(vnode.children))
        // 如果是一个数组批量递归
    } else if(Array.isArray(vnode.children)) {
        vnode.children.forEach(child => renderer(child,el))
    }
    // 将元素添加到挂载点下
    container.appendChild(el)
}

// 渲染器
// vnode 虚拟dom。
// container 一个真实dom元素，作为挂载点，渲染器会把虚拟dom渲染挂载到该挂载点下。
function renderer(vnode, container) {
    if (typeof vnode.tag === 'string') {
        // 说明 vnode描述的是标签元素
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'function') {
        // 说明 vnode 描述的是组件
        mountComponent(vnode, container)
    }

}

function mountComponent(vnode, container) {
    // 调用组件函数，获取组件要渲染的内容 （虚拟dom）
    const substree = vnode.tag()
    // 递归地调用 renderer 渲染 subtree
    renderer(substree, container)
}