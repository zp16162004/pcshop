// pages/pick_shop/pick_shop.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_shop:null,
    latitude:null,
    longitude:null,
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
    var thiss=this;
    wx.getLocation({
      type: 'gcj02',
      success:function(res)
      {
        console.log(res);
        thiss.setData(
          {
            latitude:res.latitude,
            longitude:res.longitude,
          }
        );
        thiss.get_shop();
      },
      fail:function()
      {
        util.show_model_and_back("获取经纬度失败");
      }
    })
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

  },
  get_shop:function()
  {
    var thiss=this;
    pcapi.get_shop_and_distance(
      function(res)
      {
        thiss.setData(
          {
            rows_shop:res.data.data,
          }
        );
      },
      thiss.data.latitude,
      thiss.data.longitude,
    );
  },
  pick_shop:function(e)
  {
    var thiss=this;
    var id=e.currentTarget.dataset.id;
    var row_shop=null;
    for(var i=0;i<thiss.data.rows_shop.length;i++)
    {
      if(parseInt(thiss.data.rows_shop[i].id)==parseInt(id))
      {
        row_shop=thiss.data.rows_shop[i];
      }
    }
    if(row_shop!=null)
    {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
            row_shop:row_shop,
      })
      prevPage.ini_price();
      wx.navigateBack({
            delta: 1,
      })
    }
  },
  make_tel:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_shop=thiss.data.rows_shop[index];
    var mobile=row_shop.tel;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  }
})