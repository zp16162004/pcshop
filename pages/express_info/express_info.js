// pages/express_info/express_info.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:0,
    row:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
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
    var thiss=this;
    thiss.view_order_express();
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
  view_order_express:function()
  {
    
    var thiss=this;
    pcapi.view_order_express(
      {
        order_id:thiss.data.order_id,
      },
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row:res.data.data,
            }
          );
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
})