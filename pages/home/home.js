// pages/home/home.js
const app = getApp();
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
      console.log(res.data.role.id,'权限ID')
      var roleID = res.data.role.id;
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
        if (res.data.identity == '班主任') {
          teachgrade = res.data.teachgrade;
          teachclass = res.data.teachclass;
          var dataPrisList = {
            'stuname': '',
            'stunumber': '',
            'stugrade': teachgrade,
            'stuclass': teachclass
          }
          getPrisList(this_, dataPrisList);
          getLeavenumteach(this_);
        } else if (res.data.identity == '食堂职工') {
          getLeveNum(this_);
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

var getLeavelogList = function(this_, data) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/leave/getLeavelogList',
    method: 'GET',
    data: {
      'params': JSON.stringify(data),
      'pageNumber': pageNumber_a,
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
          pageNumber_a++;
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
var getPrisList = function(this_, data) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/admin/getPristuList',
    method: 'GET',
    data: {
      'params': JSON.stringify(data),
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
var getLeveNum = function(this_) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/leave/getLeavenum',
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      this_.setData({
        cokeNum: res.data.realnum
      })
    }
  })
}

var getLeavenumteach = function(this_) {
  wx.request({
    url: 'http://123.56.195.35/askforleave/leave/getLeavenumteach',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      this_.setData({
        allnum: res.data.allnum,
        leavenums: res.data.leavenums,
        realnum: res.data.realnum
      })
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
    gclist: {
      gradeR: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      classesR: ['一班', '二班', '三班', '四班', '五班', '六班'],
    },
    searcStuhmodal: {
      modalsactive: '',
      stuname: '',
      stunumber: '',
      grade: '',
      classes: ''
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
    logsize: false,
    savestu: {
      stuname: '',
      stunumber: '',
      grade: '',
      classes: ''
    },
    cokeNum: 0,
    allnum: 0,
    leavenums: 0,
    realnum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.showNavigationBarLoading();
    pageNumber_ = 1;
    userinfoStu = [];
    this.setData({
      userinfoStu: []
    })
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    findByuserinfo(this);
    var this_ = this;
    wx.getSystemInfo({
      success: function(res) {
        this_.setData({
          autoheight: res.windowHeight,
          scrollheight: res.windowHeight - 340,
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
    } else if (this.data.userinfo.identity == '班主任') {
      var dataLeaveList = {
        'leavedates': '',
        'leavedatee': '',
        'stunumber': '',
        'stuname': '',
        'username': app.globalData.userOpenId
      }
      getLeavelogList(this, dataLeaveList);
    }
  },
  scorStubtn: function() {
    wx.showNavigationBarLoading();
    var dataPrisList = {
      'stuname': '',
      'stunumber': '',
      'stugrade': teachgrade,
      'stuclass': teachclass
    }
    getPrisList(this, dataPrisList)
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
        userinfoStu = [];
        this.setData({
          userinfoStu: []
        })
        findByuserinfo(this_);
        break;
      case '2':
        wx.showNavigationBarLoading();
        if (this.data.userinfo.identity == '家长') {
          pageNumber = 1;
          logs = [];
          this.setData({
            logs: []
          })
          getLeaveParen(this_);
        } else if (this.data.userinfo.identity == '班主任') {
          pageNumber_a = 1;
          logs = [];
          this.setData({
            logs: []
          })
          var dataLeaveList = {
            'leavedates': '',
            'leavedatee': '',
            'stunumber': '',
            'stuname': '',
            'username': app.globalData.userOpenId
          }
          getLeavelogList(this_, dataLeaveList);
        }
        break;
      case '3':
        this.setData({
          savestu: {
            stuname: '',
            stunumber: '',
            grade: teachgrade,
            classes: teachclass
          }
        })
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
  modifymodal: function(e) {
    console.log(e.currentTarget.dataset.infors);
    this.setData({
      priinfor: {
        hidden: true
      },
      onCk: 3,
      savestu: {
        stuname: e.currentTarget.dataset.infors.stuname,
        stunumber: e.currentTarget.dataset.infors.stunumber,
        grade: e.currentTarget.dataset.infors.stugrade,
        classes: e.currentTarget.dataset.infors.stuclass
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
  findStuList: function() {
    this.setData({
      searcStuhmodal: {
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
  rightbtnStu: function() {
    this.setData({
      searcStuhmodal: {
        modalsactive: ''
      }
    })
  },
  serachUlogs: function(e) {
    pageNumber_a = 1;
    logs = [];
    this.setData({
      logs: [],
      searchinfor: {
        modalsactive: ''
      }
    })
    var dataLeaveList = {
      'leavedates': e.detail.value.leavedates,
      'leavedatee': e.detail.value.leavedatee,
      'stunumber': e.detail.value.stunumber,
      'stuname': e.detail.value.stuname,
      'username': app.globalData.userOpenId
    }
    getLeavelogList(this, dataLeaveList);
  },
  restUlogs: function() {
    pageNumber_a = 1;
    logs = [];
    this.setData({
      logs: [],
      searchinfor: {
        modalsactive: ''
      }
    })
    var dataLeaveList = {
      'leavedates': '',
      'leavedatee': '',
      'stunumber': '',
      'stuname': '',
      'username': app.globalData.userOpenId
    }
    getLeavelogList(this, dataLeaveList);
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
  },
  bindgrade: function(e) {
    this.setData({
      searcStuhmodal: {
        grade: this.data.gclist.gradeR[e.detail.value]
      }
    })
  },
  bindclass: function(e) {
    this.setData({
      searcStuhmodal: {
        classes: this.data.gclist.classesR[e.detail.value]
      }
    })
  },
  serachUlist: function(e) {
    pageNumber_ = 1;
    userinfoStu = [];
    this.setData({
      searcStuhmodal: {
        modalsactive: ''
      },
      userinfoStu: []
    })
    var dataPrisList = {
      'stuname': e.detail.value.stuname,
      'stunumber': e.detail.value.stunumber,
      'stugrade': e.detail.value.grade,
      'stuclass': e.detail.value.classes
    }
    getPrisList(this, dataPrisList)
  },
  restUlist: function(e) {
    pageNumber_ = 1;
    userinfoStu = [];
    this.setData({
      searcStuhmodal: {
        modalsactive: ''
      },
      userinfoStu: []
    })
    var dataPrisList = {
      'stuname': '',
      'stunumber': '',
      'stugrade': teachgrade,
      'stuclass': teachclass
    }
    getPrisList(this, dataPrisList)
  },
  addStu: function(e) {
    var this_ = this;
    if (e.detail.value.realname == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.jobnumber == '') {
      wx.showToast({
        title: '学号不能为空',
        icon: 'none'
      })
      return;
    }
    var dataSave = {
      'stuname': e.detail.value.realname,
      'stunumber': e.detail.value.jobnumber,
      'stugrade': e.detail.value.grade,
      'stuclass': e.detail.value.classes
    }
    wx.request({
      url: 'http://123.56.195.35/askforleave/admin/savePristuds',
      method: 'GET',
      data: {
        'params': JSON.stringify(dataSave)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.info == 'add') {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          this_.setData({
            savestu: {
              stuname: '',
              stunumber: '',
              grade: teachgrade,
              classes: teachclass
            }
          })
        } else if (res.data.info == 'edit') {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          this_.setData({
            savestu: {
              stuname: '',
              stunumber: '',
              grade: teachgrade,
              classes: teachclass
            }
          })
        }
      }
    })
  }

})