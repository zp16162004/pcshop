// pages/poster_rebate/poster_rebate.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    index:0,
    rows_img:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    thiss.setData(
      {
        domain:app.globalData.domain,
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var thiss=this;
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data.systeminfo);
    console.log(this.data.menu_rect);
    this.setData(
      {
        menu_rect:thiss.data.menu_rect,
        systeminfo:thiss.data.systeminfo,
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_poster_rebate();
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
  change_index:function(e)
  {
    var thiss=this;
    console.log(e.detail.current);
    thiss.setData(
      {
        index:e.detail.current,
      }
    );
  },
  get_poster_rebate:function()
  {
    //
    var thiss=this;
    pcapi.get_poster_rebate(
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              rows_img:res.data.data,
            }
          );
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  save_poster:function()
  {
    //
    var thiss=this;
    wx.previewImage({
      urls: thiss.data.rows_img,
    })
  }
})