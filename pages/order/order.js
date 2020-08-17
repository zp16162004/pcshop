// pages/order/order.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    line_left:0,
    order_id:0,
    get_order_detail:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //domain
    var thiss=this;
    thiss.data.domain=app.globalData.domain;
    thiss.setData(thiss.data);
    //窗口信息
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log("menu_rect");
    console.log(this.data.menu_rect);
    if(options.order_id!=null)
    {
      thiss.setData(
        {
          order_id:options.order_id,
        }
      );
    }
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
    var thiss=this;
    thiss.get_order_detail();
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

  },
  get_order_detail:function()
  {
    var thiss=this;
    pcapi.get_order_detail(
      thiss.data.order_id,
      function(res)
      {
        console.log(res);
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_order:res.data.data,
            }
          );
          //初始化别的信息，类似line_left
          thiss.ini_extra_info();
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  },
  ini_extra_info:function()
  {
    //
  },
})