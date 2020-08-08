// pages/activity_flash/activity_flash.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
var md5=require("../../utils/md5.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_flashsection:[],
    row_flashsection:[],
    id_select:0,
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取活动
    this.get_flashsection();
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
  goto_product_flash:function(res)
  {
    //
    console.log(res);
    var id=res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product_flash/product_flash?id='+id,
    })
  },
  get_flashsection:function()
  {
    var thiss=this;
    pcapi.get_flashsection(
      function(res)
      {
        if(res.data.code==1)
        {
          //判断哪个正在再秒杀
          thiss.setData(
            {
              rows_flashsection:res.data.data,
            }
          );
          thiss.ini_rows_flashsection();
        }
      }
    );
  },
  ini_rows_flashsection:function()
  {
    var thiss=this;
    //更新flashsection状态
    for(var i=0;i<thiss.data.rows_flashsection.length;i++)
    {
      var row_flashsection=thiss.data.rows_flashsection[i];
      var stime=parseInt(row_flashsection.stime);
      var etime=parseInt(row_flashsection.etime);
      var now_hour=new Date().getHours();
      if(now_hour>=stime&&now_hour<etime)
      {
        thiss.data.rows_flashsection[i].status=1;
        thiss.data.row_flashsection=thiss.data.rows_flashsection[i];
        thiss.data.id_select=row_flashsection.id;
      }
      else if(now_hour<stime)
      {
        thiss.data.rows_flashsection[i].status=0;
      }
      else if(now_hour>=etime)
      {
        thiss.data.rows_flashsection[i].status=2;
      }
    }
    thiss.setData(
      thiss.data
    );
    console.log(thiss.data);
  },
  change_flashsection:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    this.setData(
      {
        row_flashsection:thiss.data.rows_flashsection[index],
      }
    );
  }
})