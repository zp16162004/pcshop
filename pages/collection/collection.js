// pages/collection/collection.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p:1,
    rows_collection:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.get_collection();
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
                thiss.get_collection();
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
    var thiss=this;
    thiss.setData(
      {
        p:thiss.data.p+1,
      }
    );
    thiss.get_collection();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  get_collection:function()
  {
    var thiss=this;
    pcapi.get_collection(
      app.globalData.row_member.id,
      thiss.data.p,
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_collection:res.data.data,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_collection:thiss.data.rows_checklog.concat(res.data.data),
            }
          );
        }
      }
    );
  },
  delete_collection:function(e)
  {
    var id=e.currentTarget.dataset.id;
    var thiss=this;
    pcapi.delete_collection(
      id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              p:1,
            }
          );
          thiss.get_collection();
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  },
})