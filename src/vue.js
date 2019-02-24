// 一个 vue类
class Vue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.$method = options.method
    // 数据劫持
    new Observer(this.$data)
    if(this.$el) {
      // 解析模板
      let c = new Compile(this.$el,this)
    }
    this.proxy(this,this.$data)
    this.proxy(this,this.$method)
  }
  // 将data和method里面的属性代理到vm上面
  proxy(vm,keys) {
    Object.keys(keys).forEach(key=> {
      Object.defineProperty(vm,key,{
        enumerable:true,
        configurable:true,
        get() {
          return keys[key]
        },
        set(newValue) {
          keys[key] = newValue
        }
      })
    })
  }
}