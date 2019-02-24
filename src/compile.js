// 定义一个解析模板的类compile
class Compile {
  constructor(el,vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) :  el
    this.vm = vm
    if(this.el) {
      let fragment = this.node2fragment(this.el)
      this.compile(fragment)
      this.el.append(fragment)
    }
  }
  // 将所有标签添加到fragment虚拟dom里面
  node2fragment(el) {
    let childNodes = el.childNodes
    let fragment = document.createDocumentFragment()
    Array.from(childNodes).forEach(node=> {
      fragment.append(node)
    })
    return fragment
  }
  // 解析模板
  compile(fragment) {
    let childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node=> {
      if(node.nodeType === 1) {
        // 解析标签指令
        this.compileElement(node,this.vm)
      }
      if(node.nodeType === 3) {
        // 解析文本
        this.compileText(node,this.vm)
      }
      // 如果是嵌套标签
      if(node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 解析标签函数
  compileElement(node,vm) {
    let attributes = node.attributes
    // 遍历属性
    Array.from(attributes).forEach(attr=> {
      if(attr.name.startsWith('v-')) {
        let type = attr.name.slice(2)
        let expr = attr.value
        if(type.split(':')[0] === 'on') {
          compileUtils['elementHandle'](node,expr,this.vm,type)
        }else {
          compileUtils[type](node,expr,this.vm)
        }
      }
    })
  }
  // 解析文本函数
  compileText(node,vm) {
    compileUtils.mustache(node,vm)
  }
}
let compileUtils =  {
  // 解析插值表式
  mustache(node,vm) {
    let content = node.textContent
    let reg = /\{\{(.+)\}\}/
    if(reg.test(content)) {
      let expr = RegExp.$1
      node.textContent = content.replace(reg,this.getVMData(vm,expr))
      new Watcher(vm,expr,newValue=> {
        node.textContent = content.replace(reg,newValue)
      })
    }
  },
  text(node,expr,vm) {
    const that = this
    node.textContent = this.getVMData(vm,expr)
    new Watcher(vm,expr,newValue=> {
      node.textContent = newValue
    })
  },
  html(node,expr,vm) {
    node.innerHTML = this.getVMData(vm,expr)
    new Watcher(vm,expr,newValue=> {
      node.innerHTML = newValue
    })
  },
  model(node,expr,vm) {
    let that = this
    node.value = this.getVMData(vm,expr)
    new Watcher(vm,expr,newValue=> {
      node.value = newValue
    })
    node.addEventListener('input',function() {
      that.setVMValue(vm,expr,this.value)
    })
  },
  elementHandle(node,expr,vm,type) {
    let eventType = type.split(':')[1]
    let fn = vm.$method && vm.$method[expr]
    if(fn && eventType) {
      node.addEventListener(eventType,fn.bind(vm))
    }
  },
  getVMData(vm,expr) {
    let data = vm.$data
    expr.split('.').forEach(key=> {
      data = data && data[key]
    })
    return data
  },
  setVMValue(vm,expr,value) {
    let data = vm.$data
    expr.split('.').forEach((key,index) => {
      if(index < expr.split('.').length-1) {
        data = data && data[key]
      }else {
        data[key] = value
      }
    })
  }
}