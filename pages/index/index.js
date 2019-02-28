const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    btninfo: '登录',
    modalinfo: {
      hidden: true,
      infos: ''
    }
  },
  onLoad: function() {
    var this_ = this;
    getApp().getUserInfo(function(userinfo) {    
      if (userinfo) {
        this_.setData({
          btninfo: '登录中...'
        })
      }
    })
    if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  },
  getUserInfo: function(e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      this.setData({
        modalinfo: {
          hidden: false,
          infos: '未授权无法使用该小程序'
        }
      })
    } else if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo
      wx.reLaunch({
        url: '../home/home'
      })
    }
  },
  confirm: function() {
    this.setData({
      modalinfo: {
        hidden: true,
        infos: ''
      },
      btninfo: '授权登录'
    })
  }
})