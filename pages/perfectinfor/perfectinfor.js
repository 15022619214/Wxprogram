// pages/perfectinfor/perfectinfor.js
var g_ = [];
var s_ = [];
const app = getApp()
var findByuserinfo = function(this_) {
  wx.request({
    url: app.globalData.appUrl +'admin/getUserByopenid',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      if (res.data != null) {
        if (res.data.role.id == 3) {
          this_.setData({
            onCk: 0,
            pageinfo: res.data.pristudents,
            item: res.data
          })
          for (var i = 0; i < res.data.pristudents.length; i++) {
            s_.push(res.data.pristudents[i].id);
          }
        } else if (res.data.role.id == 2) {
          this_.setData({
            onCk: 1,
            item: res.data,
            gradeV: res.data.teachgrade,
            classesV: res.data.teachclass
          })
        } else if (res.data.role.id == 1) {
          this_.setData({
            onCk: 2,
            item: res.data
          })
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
    onCk: 0,
    modalinfo: {
      hidden: true,
      inpval: '',
      stuinfo: {
        id: '',
        stuclass: '',
        stugrade: '',
        stuname: '',
        stunumber: ''
      }
    },
    pageinfo: [],
    vals: '',
    grade: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    classes: ['一班', '二班', '三班', '四班', '五班', '六班'],
    gradeV: '一年级',
    classesV: '一班',
    item: {
      realname: '',
      jobnumber: '',
      phone: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var this_ = this;
    findByuserinfo(this_);
    wx.showNavigationBarLoading();
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
  bindgrade: function(e) {
    this.setData({
      gradeV: this.data.grade[e.detail.value]
    })
  },
  bindclass: function(e) {
    this.setData({
      classesV: this.data.classes[e.detail.value]
    })
  },
  changeList: function(e) {
    g_ = [];
    s_ = [];
    this.setData({
      onCk: e.target.dataset.index,
      gradeV: '一年级',
      classesV: '一班',
      item: {
        realname: '',
        jobnumber: '',
        phone: ''
      },
      pageinfo: g_
    })
  },
  getChildinfo: function() {
    this.setData({
      modalinfo: {
        hidden: false,
        inpval: '',
      }
    })
  },
  closemodal: function() {
    this.setData({
      modalinfo: {
        hidden: true
      }
    })
  },
  serachform: function(e) {
    var this_ = this;
    wx.request({
      url: app.globalData.appUrl +'admin/getPristudsBystunum',
      method: 'GET',
      data: {
        'stunumber': e.detail.value.childinfo
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        this_.setData({
          modalinfo: {
            stuinfo: res.data
          }
        })
      }
    })
  },
  getStuinfo: function(e) {
    g_.push(e.currentTarget.dataset.stuinfo);
    s_.push(e.currentTarget.dataset.stuinfo.id);    
    for (var i = 0; i < g_.length; i++) {
      if (g_[i].id == e.currentTarget.dataset.stuinfo.id) {
        g_.splice(g_[i].id,1);
      }
    }
    this.setData({
      modalinfo: {
        hidden: true
      },
      pageinfo: g_
    })
  },
  clearinfo: function() {
    g_ = [];
    s_ = [];
    this.setData({
      pageinfo: g_
    })
  },
  userinfofrom: function(e) {
    var name_ = e.detail.value.name;
    var phone_ = e.detail.value.phone;
    var jobnumber_ = e.detail.value.jobnumber;
    var grade_ = e.detail.value.grade;
    var cleasses_ = e.detail.value.classes;
    var obileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.onCk == 0) {
      if (name_ == '') {
        wx.showToast({
          title: '姓名不能为空',
          icon: 'none'
        })
        return;
      }
      if (phone_ == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return;
      } else if (!obileReg.test(phone_)) {
        wx.showToast({
          title: '手机号码有误',
          icon: 'none'
        })
        return;
      }
      if (s_.length == 0) {
        wx.showToast({
          title: '请选择学生信息',
          icon: 'none'
        })
        return;
      }
      var data_ = {
        'username': app.globalData.userOpenId,
        'realname': name_,
        'phone': phone_,
        'identity': '家长',
        'pristudents': s_.toString(),
        'jobnumber': '',
        'teachgrade': '',
        'teachclass': ''
      }
      wx.request({
        url: app.globalData.appUrl +'admin/saveUser',
        method: 'GET',
        data: {
          'params': JSON.stringify(data_)
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          if (res.data.info == 'add') {
            wx.reLaunch({
              url: '../home/home'
            })
          } else if (res.data.info == 'edit') {
            wx.reLaunch({
              url: '../home/home'
            })
          }
        }
      })

    } else if (this.data.onCk == 1) {
      if (name_ == '') {
        wx.showToast({
          title: '姓名不能为空不能为空',
          icon: 'none'
        })
        return;
      }
      if (jobnumber_ == '') {
        wx.showToast({
          title: '教师工号不能为空',
          icon: 'none'
        })
        return;
      }
      if (phone_ == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return;
      } else if (!obileReg.test(phone_)) {
        wx.showToast({
          title: '手机号码有误',
          icon: 'none'
        })
        return;
      }

      var data_ = {
        'username': app.globalData.userOpenId,
        'realname': name_,
        'phone': phone_,
        'identity': '班主任',
        'pristudents': '',
        'jobnumber': jobnumber_,
        'teachgrade': grade_,
        'teachclass': cleasses_
      }
      wx.request({
        url: app.globalData.appUrl +'admin/saveUser',
        method: 'GET',
        data: {
          'params': JSON.stringify(data_)
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          if (res.data.info == 'add') {
            wx.reLaunch({
              url: '../home/home'
            })
          } else if (res.data.info == 'edit') {
            wx.reLaunch({
              url: '../home/home'
            })
          }
        }
      })
    } else if (this.data.onCk == 2) {
      if (name_ == '') {
        wx.showToast({
          title: '姓名不能为空不能为空',
          icon: 'none'
        })
        return;
      }
      if (jobnumber_ == '') {
        wx.showToast({
          title: '职工工号不能为空',
          icon: 'none'
        })
        return;
      }
      if (phone_ == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return;
      } else if (!obileReg.test(phone_)) {
        wx.showToast({
          title: '手机号码有误',
          icon: 'none'
        })
        return;
      }

      var data_ = {
        'username': app.globalData.userOpenId,
        'realname': name_,
        'phone': phone_,
        'identity': '食堂职工',
        'pristudents': '',
        'jobnumber': jobnumber_,
        'teachgrade': '',
        'teachclass': ''
      }
      wx.request({
        url: app.globalData.appUrl +'admin/saveUser',
        method: 'GET',
        data: {
          'params': JSON.stringify(data_)
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          if (res.data.info == 'add') {
            wx.reLaunch({
              url: '../home/home'
            })
          } else if (res.data.info == 'edit') {
            wx.reLaunch({
              url: '../home/home'
            })
          }
        }
      })
    }
  }
})