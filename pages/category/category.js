// pages/category/category.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_category:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_category();
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
  get_category:function()
  {
    var thiss=this;
    pcapi.get_category(
      function(res)
      {
        thiss.setData(
          {
            rows_category:res.data.data,
          }
        );
        console.log(thiss.data.rows_category);    
      }
    );
  },
  goto_product_list:function(event)
  {
    console.log(event);
    var id=event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/product_list/product_list?id='+id,
    })
  },
})