// pages/spread_rebate/spread_rebate.js
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
    row_rebate:null,
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
    thiss.get_rebate();
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
    thiss.get_rebate();
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
        p:thiss.data.p,
        sort_type:thiss.data.sort_type,
        sort:thiss.data.sort,
      },
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              row_rebate:res.data.data,
            }
          );
        }
        else
        {
          thiss.data.row_rebate.rows_child1.concat(res.data.data.rows_child1);
          thiss.data.row_rebate.rows_child2.concat(res.data.data.rows_child2);
          thiss.data.row_rebate.rows_rebate.concat(res.data.data.rows_rebate);
          thiss.setData(
            {
              row_rebate:thiss.data.row_rebate,
            }
          );
        }
      }
    );
  },
})