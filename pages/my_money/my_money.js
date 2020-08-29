// pages/my_money/my_money.js
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
    type:1,
    row_member:null,
    rows_cashflow:null,
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
    thiss.refresh_member();
    thiss.get_my_cashflow();
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
    thiss.get_my_cashflow();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  change_type:function(e)
  {
    var thiss=this;
    var type=parseInt(e.currentTarget.dataset.type);
    thiss.setData(
      {
        type:type,
        p:1,
      }
    );
    thiss.get_my_cashflow();
  },
  refresh_member:function()
  {
    var thiss=this;
    pcapi.refresh_member(
      function(res)
      {
        if(res.data.code==1)
        {
          console.log(res);
          app.globalData.row_member=res.data.data;
          app.save_data();
          thiss.setData(
          {
            row_member:app.globalData.row_member,
          }
          );
        }
      }
    );
  },
  get_my_cashflow:function()
  {
    var thiss=this;
    pcapi.get_my_cashflow(
      {
        member_id:app.globalData.row_member.id,
        type:thiss.data.type,
        p:thiss.data.p,
      },
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_cashflow:res.data.data,
              money:res.data.all_integral,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_cashflow:thiss.data.rows_cashflow.concat(res.data.data),
              money:res.data.money,
            }
          );
        }
      }
    );
  },
  show_cashout:function()
  {
    var thiss=this;
    thiss.setData(
      {
        show_cash_out:true,
      }
    );
  },
  add_cashout:function(e)
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
      pcapi.add_cashout(
        {
          member_id:app.globalData.row_member.id,
          money:money,
        },
        function(res)
        {
          if(res.data.code==1)
          {
            util.show_model(res.data.msg);
            thiss.setData(
              {
                p:1,
              }
            );
            thiss.refresh_member();
            thiss.get_my_cashflow();
          }
          else{
            util.show_model(res.data.msg);
          }
        }
      );
    }
  },
})