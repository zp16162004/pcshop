// pages/my_phone/my_phone.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    row_member:null,
    mobile:'',
    vcode:'',
    my_vcode:'',
    interval:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    thiss.setData(
      {
        domain:app.globalData.domain,
        row_member:app.globalData.row_member,
        mobile:app.globalData.row_member.mobile,
      }
    );
    setInterval(
      function()
      {
        thiss.check_time();
      },
      1000
    )
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  check_time:function()
  {
    var thiss=this;
    if(thiss.data.interval>0)
    {
      thiss.setData(
        {
          interval:thiss.data.interval-1,
        }
      );
    }
  },
  get_vcode:function()
  {
    var thiss=this;
    if(thiss.data.mobile=='')
    {
      util.show_model("请输入手机号码");
      return;
    }
    if(thiss.data.interval==0)
    {
      pcapi.get_vcode(
        {
          mobile:thiss.data.mobile,
        },
        function(res)
        {
          if(res.data.code==0)
          {
            util.show_model(res.data.msg);
          }
          else{
            thiss.setData(
              {
                interval:60,
                vcode:res.data.data,
              }
            );
          }
        }
      );
    }
  },
  change_mobile:function(e)
  {
    var mobile=e.detail.value;
    var thiss=this;
    thiss.setData(
      {
        mobile:mobile,
        vcode:'',
      }
    );
  },
  change_my_vcode:function(e)
  {
    var my_vcode=e.detail.value;
    var thiss=this;
    thiss.setData(
      {
        my_vcode:my_vcode,
      }
    );
  },
  submit:function(e)
  {
    var thiss=this;
    if(thiss.data.mobile=='')
    {
      util.show_model("请输入手机号码");
      return;
    }
    if(thiss.data.vcode=='')
    {
      util.show_model("请获取验证码");
      return;
    }
    if(thiss.data.my_vcode!=thiss.data.vcode)
    {
      util.show_model("验证码错误");
      return;
    }
    pcapi.change_mobile(
      {
        member_id:thiss.data.row_member.id,
        mobile:thiss.data.mobile,
      },
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
})