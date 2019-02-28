// pages/home/home.js
const app = getApp()
var teachgrade = null;
var teachclass = null;
var findByuserinfo = function(this_) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/admin/getUserByopenid',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res.data);
      if (res.data == null) {
        this_.setData({
          modalinfo: {
            hidden: false,
            infos: '您的信息不完善，使用前请先完善个人信息'
          }
        })
      } else {
        this_.setData({
          userinfo: res.data,
          userinfoStu: res.data.pristudents
        })
        if (res.data.identity == '教师') {
          teachgrade = res.data.teachgrade;
          teachclass = res.data.teachclass;
          getPrisList(this_, teachgrade, teachclass);
        }
      }
      wx.hideNavigationBarLoading();
    }
  })
}

var pageNumber = 1;
var pageNumber_a = 1;
var logs = [];
var getLeaveParen = function(this_) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/leave/getLeavelogParent',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId,
      'pageNumber': pageNumber,
      'pageSize': 10
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      logs = this_.data.logs;
      if (res.data != null) {
        if (res.data.content.length > 0) {
          for (var i = 0; i < res.data.content.length; i++) {
            logs.push(res.data.content[i]);
          }
          this_.setData({
            logs: logs,
            logsize: true
          })
          pageNumber++;
        } else {
          this_.setData({
            logsize: false
          })
        }
      }
      wx.hideNavigationBarLoading();
    }
  })
}

var getLeavelogList = function(this_, dataPrisList) {
  console.log(JSON.stringify(dataPrisList));
  wx.request({
    url: 'http://123.56.195.35/askforleave/leave/getLeavelogList',
    method: 'GET',
    data: {
      'params': JSON.stringify(dataPrisList),
      'pageNumber': pageNumber_a,
      'pageSize': 10
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res.data);
      logs = this_.data.logs;
      if (res.data != null) {
        if (res.data.content.length > 0) {
          for (var i = 0; i < res.data.content.length; i++) {
            logs.push(res.data.content[i]);
          }
          this_.setData({
            logs: logs,
            logsize: true
          })
          pageNumber++;
        } else {
          this_.setData({
            logsize: false
          })
        }
      }
      wx.hideNavigationBarLoading();
    }
  })
}

var pageNumber_ = 1;
var userinfoStu = [];
var getPrisList = function(this_, stugrade, stuclass) {
  var dataPrisList = {
    'stuname': '',
    'stunumber': '',
    'stugrade': stugrade,
    'stuclass': stuclass
  }
  wx.request({
    url: 'http://123.56.195.35/askforleave/admin/getPristuList',
    method: 'GET',
    data: {
      'params': JSON.stringify(dataPrisList),
      'pageNumber': pageNumber_,
      'pageSize': 20
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      userinfoStu = this_.data.userinfoStu;
      if (res.data != null) {
        if (res.data.content.length > 0) {
          for (var i = 0; i < res.data.content.length; i++) {
            userinfoStu.push(res.data.content[i]);
          }
          this_.setData({
            userinfoStu: userinfoStu,
          })
          pageNumber_++;
        }
      }
      wx.hideNavigationBarLoading();
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: '',
    userInfo: {},
    logs: [],
    modalinfo: {
      hidden: true,
      infos: ''
    },
    priinfor: {
      hidden: true,
      infors: []
    },
    searchinfor: {
      modalsactive: '',
      stuname: '',
      stunumber: '',
      leavedates: '',
      leavedatee: ''
    },
    onCk: 0,
    autoheight: 0,
    scrollheight: 0,
    logheight: 0,
    userinfo: [],
    userinfoStu: [],
    dateS: '2018-01-01',
    dateM: '2018-01-01',
    childid: 0,
    start: '',
    logsize: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading();
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    findByuserinfo(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var this_ = this;
    wx.getSystemInfo({
      success: function(res) {
        this_.setData({
          autoheight: res.windowHeight,
          scrollheight: res.windowHeight - 310,
          logheight: res.windowHeight - 40
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  scorbtn: function() {
    wx.showNavigationBarLoading();
    if (this.data.userinfo.identity == '家长') {
      getLeaveParen(this);
    } else if (this.data.userinfo.identity == '教师') {
      getPrisList(this, teachgrade, teachclass)
    }
  },
  confirm: function() {
    wx.reLaunch({
      url: '../perfectinfor/perfectinfor'
    })
  },
  changeList: function(e) {
    var this_ = this;
    var o_ = e.currentTarget.dataset.index;
    this.setData({
      onCk: e.currentTarget.dataset.index
    })
    switch (o_) {
      case '0':
        wx.showNavigationBarLoading();
        pageNumber_ = 1;
        this.setData({
          userinfoStu: []
        })
        findByuserinfo(this_);
        break;
      case '2':
        wx.showNavigationBarLoading();
        if (this.data.userinfo.identity == '家长') {
          pageNumber = 1;
          this.setData({
            logs: []
          })
          getLeaveParen(this_);
        } else if (this.data.userinfo.identity == '教师') {
          pageNumber_a = 1;
          this.setData({
            logs: []
          })
          var dataPrisList = {
            'leavedates': '',
            'leavedatee': '',
            'stunumber': '',
            'stuname': '',
            'username': app.globalData.userOpenId
          }
          getLeavelogList(this_, dataPrisList);
        }
        break;
    }
  },
  radioChange: function(e) {
    this.setData({
      childid: e.detail.value
    })
  },
  bindDateS: function(e) {
    this.setData({
      dateS: e.detail.value,
      start: e.detail.value,
      dateM: e.detail.value
    })
  },
  bindDateM: function(e) {
    this.setData({
      dateM: e.detail.value
    })
  },
  leaveSubmit: function(e) {
    var data = {
      'username': app.globalData.userOpenId,
      'stuid': this.data.childid,
      'leavedates': this.data.dateS,
      'leavedatee': this.data.dateM,
      'leavereason': e.detail.value.textarea
    }
    wx.request({
      url: 'http://123.56.195.35/askforleave/leave/saveLeavelogs',
      method: 'GET',
      data: {
        'params': JSON.stringify(data)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.showToast({
          title: '申请成功',
          icon: 'none'
        })
      }
    })
  },
  modify: function() {
    wx.navigateTo({
      url: '../perfectinfor/perfectinfor',
    })
  },
  lookover: function(e) {
    var this_ = this;
    wx.request({
      url: 'http://123.56.195.35/askforleave/admin/getPristudsBystunum',
      method: 'GET',
      data: {
        'stunumber': e.currentTarget.dataset.stunumber
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        this_.setData({
          priinfor: {
            hidden: false,
            infors: res.data
          }
        })
      }
    })
  },
  closemodal: function() {
    this.setData({
      priinfor: {
        hidden: true
      }
    })
  },
  findStu: function() {
    this.setData({
      searchinfor: {
        modalsactive: 'modalsactive'
      }
    })
  },
  rightbtn: function() {
    this.setData({
      searchinfor: {
        modalsactive: '',
        stuname: '',
        stunumber: '',
        leavedates: '',
        leavedatee: ''
      }
    })
  },
  serachUlogs: function(e) {
    pageNumber_a = 1;
    this.setData({
      logs: [],
      searchinfor: {
        modalsactive: 'modalsactive'
      }
    })
    var dataPrisList = {
      'leavedates': e.detail.value.leavedates,
      'leavedatee': e.detail.value.leavedatee,
      'stunumber': e.detail.value.stunumber,
      'stuname': e.detail.value.stuname,
      'username': app.globalData.userOpenId
    }
    getLeavelogList(this, dataPrisList);
  },
  restUlogs: function() {
    pageNumber_a = 1;
    this.setData({
      logs: [],
      searchinfor: {
        modalsactive: 'modalsactive'
      }
    })
    var dataPrisList = {
      'leavedates': '',
      'leavedatee': '',
      'stunumber': '',
      'stuname': '',
      'username': app.globalData.userOpenId
    }
    getLeavelogList(this, dataPrisList);
  },
  datebtnS: function(e) {
    this.setData({
      searchinfor: {
        leavedates: e.detail.value
      }
    })
  },
  datebtnM: function(e) {
    this.setData({
      searchinfor: {
        leavedatee: e.detail.value
      }
    })
  }
})