// pages/pick_address/pick_address.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_address:null,
    member_id:0,
    scroll_height:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    this.data.scroll_height=this.data.systeminfo.windowHeight-util.rpx2px(80,this.data.systeminfo);
    this.data.member_id=app.globalData.row_member.id;
    console.log(this.data.systeminfo);
    console.log(this.data.menu_rect);
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  get_address:function()
  {
    var thiss=this;
    pcapi.get_address(
      app.globalData.row_member.id,
      function(res)
      {
        thiss.setData(
          {
            rows_address:res.data.data,
          }
        );
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_address();
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
  goto_add_address:function()
  {
    wx.navigateTo({
      url: '/pages/add_address/add_address',
    })
  },
  change_is_default:function(e)
  {
    var thiss=this;
    var id=e.currentTarget.dataset.id;
    pcapi.set_is_default(app.globalData.row_member.id,id,
        function()
        {
          thiss.get_address();
        }
      );
  },
  delete_address:function(e)
  {
    var thiss=this;
    var id=e.currentTarget.dataset.id;
    util.alert(
      "确定删除该收货地址吗",
      function()
      {
        pcapi.delete_address(id,
            function()
            {
              thiss.get_address();
            }
          );
      },
      function()
      {
        //
      }
    );
  },
  edit_address:function(e)
  {
    var thiss=this;
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/add_address/add_address?id='+id,
    })
  },
  select_address:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_address=thiss.data.rows_address[index];
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
          row_address:row_address,
    })
    prevPage.ini_price();
    wx.navigateBack({
          delta: 1,
    })
  }
})