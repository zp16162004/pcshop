// pages/qrcode_order/qrcode_order.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
var QRCode=require("../../utils/weapp-qrcode.js");
const app = getApp();
var qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systeminfo:null,
    menu_rect:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        thiss.data.systeminfo=result;
      },
    });
    thiss.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    if(options.orderno!=null)
    {
      thiss.data.orderno=options.orderno;
    }
    thiss.setData(
      {
        systeminfo:thiss.data.systeminfo,
        menu_rect:thiss.data.menu_rect,
        orderno:thiss.data.orderno,
      }
    );
    qrcode = new QRCode('canvas', {
        // usingIn: this,
        text: thiss.data.orderno,
        width: util.rpx2px(600,thiss.data.systeminfo),
        height: util.rpx2px(600,thiss.data.systeminfo),
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})