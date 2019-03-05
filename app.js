//app.js
App({
  globalData: {
    userInfo: null,
    userOpenId: null,
    appUrl:'http://qjd.tjfirstcloud.com/'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    var this_ = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this_.globalData.appUrl +'getapi/getopenidnew',
          method:'GET',
          data:{
            'code': res.code
          },
          header: {
            'Content-Type': 'application/json'
          },
          success:function(res){         
            this_.globalData.userOpenId = res.data.openId;
            console.log(this_.globalData.userOpenId)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              setTimeout(function () {
                wx.reLaunch({
                  url: '../home/home'
                })
              }, 2000)
            }
          })
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var this_ = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function (res) {
          this_.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(this_.globalData.userInfo)
        }
      })
    }
  }
})