// pages/spread_rebate_sort/spread_rebate_sort.js
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
    rows_rebate_sort:null,
    index:0,
    sort:-1,
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
    thiss.get_rebate_sort();
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
    thiss.get_rebate_sort();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  change_index:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    thiss.setData(
      {
        index:index,
        p:1
      }
    );
    thiss.get_rebate_sort();
  },
  get_rebate_sort:function()
  {
    var thiss=this;
    //计算开始日期和结束日期
    var sdate='';
    if(thiss.data.index==0)
    {
      sdate=util.ftime(new Date().getTime()-6*24*3600*1000,'Y-M-D')+" 00:00:00";
    }
    else
    {
      sdate=util.ftime(new Date().getTime()-29*24*3600*1000,'Y-M-D')+" 00:00:00";
    }
    var edate=util.ftime(new Date().getTime(),'Y-M-D')+" 23:59:59";
    pcapi.get_rebate_sort(
      {
        member_id:app.globalData.row_member.id,
        p:thiss.data.p,
        sdate:sdate,
        edate:edate,
      },
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_rebate_sort:res.data.data,
              sort:res.data.sort,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_rebate_sort:thiss.data.rows_rebate_sort.concat(res.data.data),
              sort:res.data.sort,
            }
          );
        }
      }
    );
  },
})