//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    todos: [],
    current: '',//用户的当前在输入的todo
    motto: 'Hello World',
    userInfo: {}
  },
  bindkeyInput: function(e) {
    this.data.current = e.detail.value
  },
  addItem: function (e) {
    // 将用户输入的todo项拿到 存储到野狗
    // 传统的js 用document.querySelector(input).value 将界面和数据 模棱两可
    // 用户没输入 正在输入 完成 三种状态 每种都对current 数据项进行数据的维护 value={{current}}
    // 现在是数据绑定的界面， 尽量减少dom的查找以及修改， 交给框架小程序如vue
    // 这个思想叫mvvm-----界面   数据
    console.log(this.data.current)
    if(this.data.current !== '') {
      // 应用程序级别的逻辑以及当前页面的逻辑
      app.addItem(this.data.current)
      // 添加完了，清空文本框内容
      this.setData({
        current: ''
      })
    }
  },
  deleteItem: function (e) {
    // 数据集合： collections
    // 传统概念里叫做数据表 excel 每一行row ->child 每一列column -> field字段
    // NoSQL 对js友好 面向文档的数据库
    var key = e.target.dataset.key
    //找到那行并删掉 key:value
    this.ref.child(key).remove();

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.ref = app.getTodoRef()
    this.ref.on('child_added', function (snapshot, prKey) {
      // 事件监听： 数据从小程序去到野狗的服务器 这个是个异步的过程 需要时间
      // 在js里所有需要花时间的 我们都定义事件
      var key = snapshot.key()
      var text =snapshot.val()
      // newItem是todo的一个json对象
      // 野狗是文档数据库 里面存储的就是json对象
      var newItem = {key:key, text:text}
      // 新增一条 维护好todos
      this.data.todos.push(newItem)
      //　通知界面更新
      this.setData({
        todos: this.data.todos
      })
    }, this)
    this.ref.on('child_removed', function (snapshot) {
      var key = snapshot.key()
      // 如何在数组中删除一个存在的项
      // 遍历比对
      var index = this.data.todos.findIndex(function (item, index) {
        if(item.key === key) return true
        return false
      })
      // splice方法 从某个下标位置删除多少个
      if (index >=0) {
        this.data.todos.splice(index, 1)
        //管界面- 改数据
        this.setData({
          todos: this.data.todos
        })
      }
    }, this)
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
