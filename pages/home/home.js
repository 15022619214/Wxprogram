// pages/home/home.js
const app = getApp();
const util = require('../../utils/util.js');
var teachgrade = null;    
var teachclass = null;
var identity = '班主任';
var month = '';
var ids = [];
var roleiden = '';
var findByuserinfo = function(this_) {
  wx.request({
    url: app.globalData.appUrl + 'admin/getUserByopenid',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      if (res.data == null) {
        this_.setData({
          modalinfo: {
            hidden: false,
            infos: '您的信息不完善，使用前请先完善个人信息'
          }
        })
      } else {
        var roleID = res.data.role.id;
        if (res.data.role.id == 0) {
          this_.setData({
            showTost: {
              hidden: false
            }
          })
        } else {
          this_.setData({
            userinfo: res.data,
            userinfoStu: res.data.pristudents
          })
          if (res.data.role.id == 2) {
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
          } else if (res.data.role.id == 1) {
            getLeveNum(this_);
          } else if (res.data.role.id == -1) {
            getLeveNum(this_);
          }
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
    url: app.globalData.appUrl + 'leave/getLeavelogParent',
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
        } 
      }
      wx.hideNavigationBarLoading();
    }
  })
}

var getLeavelogList = function(this_, data) {
  wx.request({
    url: app.globalData.appUrl + 'leave/getLeavelogList',
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
    url: app.globalData.appUrl + 'admin/getPristuList',
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
    url: app.globalData.appUrl + 'leave/getLeavenum',
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
    url: app.globalData.appUrl + 'leave/getLeavenumteach',
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

var getUserList = function(this_, data) {
  wx.request({
    url: app.globalData.appUrl + 'admin/getUserList',
    method: 'GET',
    data: {
      'params': JSON.stringify(data),
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].ischecked = false
        }
        this_.setData({
          userlist: res.data
        })
      }
      wx.hideNavigationBarLoading();
    }
  })
}

var leavelogsmonth = function(this_, month) {
  wx.request({
    url: app.globalData.appUrl + 'leave/leavelogsmonth',
    method: 'GET',
    data: {
      'username': app.globalData.userOpenId,
      'month': month
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      if (res.data.length > 0) {
        this_.setData({
          stumonth: res.data,
          logmonth: true
        })
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
    userInfo: [],
    logs: [],
    userlist: [],
    stumonth: [],
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
    searchuser: {
      modalsactive: '',
    },
    userinfor: {
      hidden: true,
      infors: []
    },
    gclist: {
      gradeR: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      classesR: ['一班', '二班', '三班', '四班', '五班', '六班'],
    },
    showTost: {
      hidden: true
    },
    searcStuhmodal: {
      modalsactive: '',
      stuname: '',
      stunumber: '',
      grade: '',
      classes: ''
    },
    searchmonth: {
      modalsactive: '',
      selectMonth: ''
    },
    modifyRole: {
      hidden: true,
      items: []
    },
    onCkadmin: 0,
    onCk: 0,
    autoheight: 0,
    scrollheight: 0,
    logheight: 0,
    roleheight: 0,
    excelheight: 0,
    userinfo: [],
    userinfoStu: [],
    dateS: util.formatTime_yyyMMdd(new Date()),
    dateM: util.formatTime_yyyMMdd(new Date()),
    childid: 0,
    start: '',
    logsize: false,
    logmonth: false,
    savestu: {
      stuname: '',
      stunumber: '',
      grade: '',
      classes: ''
    },
    cokeNum: 0,
    allnum: 0,
    leavenums: 0,
    realnum: 0,
    selectAll: false,
    downloadfile: 0
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
          scrollheight: res.windowHeight - 369,
          logheight: res.windowHeight - 40,
          roleheight: res.windowHeight - 154,
          excelheight: res.windowHeight - 113
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
  admincg: function(e) {
    wx.showNavigationBarLoading();
    var index = e.currentTarget.dataset.index;
    this.setData({
      onCkadmin: e.currentTarget.dataset.index
    })
    if (index == 0) {
      identity = '班主任';
    } else if (index == 1) {
      identity = '食堂职工';
    }
    this.setData({
      userlist: [],
      selectAll: false
    })
    var dataUserList = {
      'realname': '',
      'phone': '',
      'identity': identity,
      'jobnumber': ''
    }
    getUserList(this, dataUserList);
  },
  scorbtn: function() {
    wx.showNavigationBarLoading();
    if (this.data.userinfo.role.id == 3) {
      getLeaveParen(this);
    } else if (this.data.userinfo.role.id == 2) {
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
  scorUserbtn: function() {
    wx.showNavigationBarLoading();
    var dataUserList = {
      'realname': '',
      'phone': '',
      'identity': identity,
      'jobnumber': ''
    }
    getUserList(this, dataUserList);
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
          userinfoStu: [],
          userlist: [],
          onCkadmin: 0
        })
        findByuserinfo(this_);
        break;
      case '2':
        wx.showNavigationBarLoading();
        if (this.data.userinfo.role.id == 3) {
          pageNumber = 1;
          logs = [];
          this.setData({
            logs: []
          })
          getLeaveParen(this_);
        } else if (this.data.userinfo.role.id == 2) {
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
      case '4':
        wx.showNavigationBarLoading();
        this.setData({
          userlist: []
        })
        var dataUserList = {
          'realname': '',
          'phone': '',
          'identity': identity,
          'jobnumber': ''
        }
        getUserList(this, dataUserList);
        break;
      case '5':
        wx.showNavigationBarLoading();
        this.setData({
          stumonth: []
        })
        leavelogsmonth(this, '');
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
    if (this.data.childid == '') {
      wx.showToast({
        title: '请选择一个学生',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '请填写请假原因',
        icon: 'none'
      })
      return;
    }
    var data = {
      'username': app.globalData.userOpenId,
      'stuid': this.data.childid,
      'leavedates': this.data.dateS,
      'leavedatee': this.data.dateM,
      'leavereason': e.detail.value.textarea
    }
    wx.request({
      url: app.globalData.appUrl + 'leave/saveLeavelogs',
      method: 'GET',
      data: {
        'params': JSON.stringify(data)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.istc == 'ok') {
          wx.showToast({
            title: '申请成功，已退餐',
            icon: 'none'
          })
        } else if (res.data.istc == 'no') {
          wx.showToast({
            title: '申请成功，当日退餐时间已过',
            icon: 'none'
          })
        } else if (res.data.info == 'err'){
          wx.showToast({
            title: '请勿重复申请',
            icon: 'none'
          })
        }
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
      url: app.globalData.appUrl + 'admin/getPristudsBystunum',
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
  lookUser: function(e) {
    var this_ = this;
    wx.request({
      url: app.globalData.appUrl + 'admin/getUserByopenid',
      method: 'GET',
      data: {
        'username': e.currentTarget.dataset.username
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        this_.setData({
          userinfor: {
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
      },
      userinfor: {
        hidden: true
      },
      modifyRole: {
        hidden: true,
        items: [{
            id: '1',
            value: '班主任'
          },
          {
            id: '2',
            value: '餐厅管理人员'
          },
        ]
      }
    })
  },
  modifymodal: function(e) {
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
  findUser: function() {
    this.setData({
      searchuser: {
        modalsactive: 'modalsactive'
      }
    })
  },
  findMonth: function() {
    this.setData({
      searchmonth: {
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
  rightbtnUser: function() {
    this.setData({
      searchuser: {
        modalsactive: ''
      }
    })
  },
  rightbtnMonth: function() {
    this.setData({
      searchmonth: {
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
  datebtnMonth: function(e) {
    this.setData({
      searchmonth: {
        selectMonth: e.detail.value
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
      url: app.globalData.appUrl + 'admin/savePristuds',
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
            title: '保存成功,该生序列号为：' + res.data.scode,
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
  },
  serachUmon: function(e) {
    this.setData({
      searchmonth: {
        modalsactive: ''
      },
      stumonth: []
    })
    month = e.detail.value.selectMonth;
    leavelogsmonth(this, e.detail.value.selectMonth)
  },
  restUmon: function(e) {
    this.setData({
      searchmonth: {
        modalsactive: ''
      },
      stumonth: []
    })
    month = null;
    leavelogsmonth(this, '')
  },
  serachUs: function(e) {
    this.setData({
      searchuser: {
        modalsactive: '',
      },
      userlist: [],
      selectAll: false
    })
    var dataUserList = {
      'realname': e.detail.value.realname,
      'phone': e.detail.value.phone,
      'identity': identity,
      'jobnumber': e.detail.value.jobnumber
    }
    getUserList(this, dataUserList);
  },
  restUs: function(e) {
    this.setData({
      searchuser: {
        modalsactive: '',
      },
      userlist: [],
      selectAll: false
    })
    var dataUserList = {
      'realname': '',
      'phone': '',
      'identity': identity,
      'jobnumber': ''
    }
    getUserList(this, dataUserList);
  },
  chkRole: function(e) {
    ids = e.detail.value;
  },
  selectAll: function(e) {
    ids = [];
    this.data.selectAll = !this.data.selectAll;
    for (var i = 0; i < this.data.userlist.length; i++) {
      this.data.userlist[i].ischecked = this.data.selectAll;
      if (this.data.selectAll) {
        ids.push(this.data.userlist[i].id + '')
      }
    }
    this.setData({
      userlist: this.data.userlist
    })
  },
  radiorole: function(e) {
    roleiden = e.detail.value;
  },
  showRole: function() {
    if (ids.length == 0) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
      })
      return;
    }
    this.setData({
      modifyRole: {
        hidden: false,
        items: [{
            id: '2',
            value: '班主任'
          },
          {
            id: '1',
            value: '餐厅管理人员'
          },
        ]
      }
    })
  },
  giveRole: function() {
    this.setData({
      modifyRole: {
        hidden: true
      }
    })
    var datarole = {
      'ids': ids,
      'roleid': roleiden
    }
    var this_ = this;
    wx.request({
      url: app.globalData.appUrl + 'admin/saveallUserrole',
      method: 'GET',
      data: {
        'params': JSON.stringify(datarole)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.showNavigationBarLoading();
        wx.showToast({
          title: '赋予成功',
          icon: 'none'
        })
        this_.setData({
          userlist: []
        })
        var dataUserList = {
          'realname': '',
          'phone': '',
          'identity': identity,
          'jobnumber': ''
        }
        getUserList(this_, dataUserList);
      }
    })
  },
  download: function() {
    console.log(month);
    wx.request({
      url: app.globalData.appUrl + 'leave/leavelogsmonthout',
      method: 'GET',
      data: {
        'username': app.globalData.userOpenId,
        'month': month
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(app.globalData.appUrl + res.data.path);
        const downloadTask = wx.downloadFile({
          url: app.globalData.appUrl + res.data.path,
          success(res) {
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function(res) {
                var savedFilePath = res.savedFilePath;
                console.log(savedFilePath);
                wx.openDocument({
                  filePath: savedFilePath,
                  fileType: 'xls',
                  success(res) {
                    console.log('打开文档成功')
                  }
                })
                wx.getSavedFileList({
                  success(res) {
                    console.log(res.fileList)
                    console.log(res.fileList["0"].filePath);
                    if (res.fileList.length > 0) {
                      wx.removeSavedFile({
                        filePath: res.fileList["0"].filePath,
                      })
                    }
                  }
                })
              }
            })

          }
        })
        downloadTask.onProgressUpdate((res) => {
          // this.setData({
          //   downloadfile: res.progress
          // })
          console.log('下载进度', res.progress)
          console.log('已经下载的数据长度', res.totalBytesWritten)
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
      }
    })
  }

})