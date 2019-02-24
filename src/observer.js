// 数据劫持
class Observer {
  constructor(data) {
    this.data = data
    // 遍历数据进行劫持
    this.walk(this.data)
  }
  walk(data) {
    if(typeof data === 'string') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defindReative(data,key,data[key])
      this.walk(data[key])
    });
  }

  // 响应式数据
  defindReative(data,key,value) {
    let dep = new Dep()
    let that = this
    Object.defineProperty(data,key,{
      enumerable:true,
      configurable:true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if(newValue !== value) {
          value = newValue
          dep.notify()
          that.walk(value)
        }
      }
    })
  }
}