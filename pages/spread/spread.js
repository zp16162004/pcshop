// pages/spread/spread.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    show_login:false,
    show_cash_out:false,
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.get_rebate();
    }
  },
  //获取用户信息权限
  do_login:function(res)
  {
    this.setData(
      {
        show_login:false,
      }
    );
    console.log(res);
    wx.login({
      success:function(res)
      {
        console.log(res.code);
        pcapi.do_login(res.code,
            function(res)
            {
              console.log(res);
              if(res.data.code==1)
              {
                app.globalData.row_member=res.data.data;
                app.save_data();
                thiss.get_rebate();
              }
              else{
                util.show_model_and_back(res.data.msg);
              }
            }
          );
      },
      fail:function(res)
      {
        util.show_model_and_back('登录失败');
      }
    })
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
  get_rebate:function()
  {
    var thiss=this;
    pcapi.get_rebate(
      {
        member_id:app.globalData.row_member.id,
        p:1
      },
      function(res)
      {
        thiss.setData(
          {
            row_rebate:res.data.data,
          }
        );
      }
    );
  },
  goto_poster_rebate:function()
  {
    wx.navigateTo({
      url: '/pages/poster_rebate/poster_rebate',
    })
  },
  goto_spread_child:function()
  {
    wx.navigateTo({
      url: '/pages/spread_child/spread_child',
    })
  },
  goto_spread_rebate:function()
  {
    wx.navigateTo({
      url: '/pages/spread_rebate/spread_rebate',
    })
  },
  goto_spread_child_order:function()
  {
    wx.navigateTo({
      url: '/pages/spread_child_order/spread_child_order',
    })
  },
  goto_spread_child_sort:function()
  {
    wx.navigateTo({
      url: '/pages/spread_child_sort/spread_child_sort',
    })
  },
  goto_spread_rebate_sort:function()
  {
    wx.navigateTo({
      url: '/pages/spread_rebate_sort/spread_rebate_sort',
    })
  },
  show_cashout:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        show_cash_out:true,
      }
    );
  },
  add_rebateout:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        show_cash_out:false,
      }
    );
    if(e.detail.code==1)
    {
      var money=e.detail.money;
      pcapi.add_rebateout(
        {
          member_id:app.globalData.row_member.id,
          money:money,
        },
        function(res)
        {
          if(res.data.code==1)
          {
            util.show_model(res.data.msg);
            thiss.get_rebate();
          }
          else{
            util.show_model(res.data.msg);
          }
        }
      );
    }
  },
})