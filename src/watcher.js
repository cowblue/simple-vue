// 一个监听类，用来关联compile和observer
class Watcher {
  constructor(vm,expr,cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    Dep.target = this
    this.oldValue = this.getVMData(this.vm,this.expr)
    Dep.target = null
  }
  update() {
    let newValue = this.getVMData(this.vm,this.expr)
    if(newValue !== this.oldValue) {
      typeof this.cb === 'function' && this.cb(newValue,this.oldValue)
    }
  }
  getVMData(vm,expr) {
    let data = vm.$data
    expr.split('.').forEach(key=> {
      data = data && data[key]
    })
    return data
  }
}
class Dep {
  constructor () {
    this.subs = []
  }
  // 收集所有的watch
  addSub(watcher) {
    this.subs.push(watcher)
  }
  // 通知改变视图
  notify() {
    this.subs.forEach(sub=> {
      sub.update()
    })
  }
}