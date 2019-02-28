// pages/childinfo/childinfo.js
var data = [{
    name: "iOS",
    value: 4,
    color: "rgb(0,164,227)"
  },
  {
    name: "Android",
    value: 3,
    color: "rgb(246,172,26)"
  },
  {
    name: "微信小程序",
    value: 6,
    color: "rgb(25,173,94)"
  },
  {
    name: "H5",
    value: 12,
    color: "rgb(142,195,31)"
  },
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuinfo: {
      stuclass: '',
      stugrade: '',
      stuname: '',
      stunumber: ''
    }
  },
  serachform: function(e) {
    console.log(e.detail.value.childinfo);
    var this_ = this;
    wx.request({
      url: 'http://123.56.195.35/askforleave/admin/getPristudsBystunum',
      method: 'GET',
      data: {
        'stunumber': e.detail.value.childinfo
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        this_.setData({
          stuinfo: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var options = {
      data: data,
      legend: '{c}',
      chartRatio: 0,
      style: 'ring',
      showLegend: true,
      showLabel: true,
      animation: true,
      showTooltip: true,
      tooltip: '{a}：{b}人',
    }
    this.roseComp = this.selectComponent('#ring');
    console.log(this.roseComp,'11111111111')
    this.roseComp.setOptions(options);
    this.roseComp.initChart(320, 213);
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

  }
})