// pages/my_integral/my_integral.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    p:1,
    rows_integrallog:null,
    all_integral:0,
    sum_integral:0,
    use_integral:0,
    today_integral:0,
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
    thiss.get_my_integrallog();
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
    thiss.get_my_integrallog();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  get_my_integrallog:function()
  {
    var thiss=this;
    pcapi.get_my_integrallog(
      {
        member_id:app.globalData.row_member.id,
        p:thiss.data.p,
      },
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_integrallog:res.data.data,
              all_integral:res.data.all_integral,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_integrallog:thiss.data.rows_integrallog.concat(res.data.data),
              all_integral:res.data.all_integral,
              sum_integral:res.data.sum_integral,
              use_integral:res.data.use_integral,
              today_integral:res.data.today_integral,
            }
          );
        }
      }
    );
  },
})