//app.js
// sdk wilddog 可以解决我们数据存储的问题
// 云服务器，todo（数据库） 其实就是一个对象文档集合 mongodb
var wilddog = require('wilddog-weapp-all')
App({
  onLaunch: function() {
    //wilddog配置
    var config = {
      //wilddog 哪个项目跟小程序对应
      // 相当于数据库
      syncURL: 'https://rzztodo.wilddogio.com'
    }
    wilddog.initializeApp(config)
    // 跟todo数据表对应起来 ref表示相关性
    this.ref = wilddog.sync().ref('todo')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 负责应用级别的数据通信
  addItem: function(todo) {
    // todo的数据表对象 这叫做数据的对象化
    this.ref.push(todo)
  },
  getTodoRef: function() {
    return this.ref
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
