// pages/add_address/add_address.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[],
    is_default:0,
    name:"",
    mobile:"",
    address:"",
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    if(options.id!=null)
    {
      thiss.setData(
        {
          id:parseInt(options.id),
        }
      );
    }
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
    var thiss=this;
    if(thiss.data.id>0)
    {
      thiss.get_address_by_id();
    }
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
  bindRegionChange:function(e)
  {
    this.setData({
      region: e.detail.value
    })
  },
  change_is_default:function(e)
  {
    var is_default=e.currentTarget.dataset.val;
    this.setData(
      {
        is_default:parseInt(is_default),
      }
    );
  },
  change_name:function(e)
  {
    console.log(e);
    this.setData(
      {
        name:e.detail.value,
      }
    );
  },
  change_mobile:function(e)
  {
    this.setData(
      {
        mobile:e.detail.value,
      }
    );
  },
  change_address:function(e)
  {
    this.setData(
      {
        address:e.detail.value,
      }
    );
  },
  submit:function()
  {
    //
    var thiss=this;
    if(thiss.data.name=="")
    {
      wx.showToast({
        title: '请输入姓名',
      })
      return;
    }
    else if(thiss.data.mobile=="")
    {
      wx.showToast({
        title: '请输入联系电话',
      })
      return;
    }
    else if(thiss.data.address=="")
    {
      wx.showToast({
        title: '请填写具体地址',
      })
      return;
    }
    else if(thiss.data.region.length==0)
    {
      wx.showToast({
        title: '请选择所在地区',
      })
      return;
    }
    else
    {
      if(thiss.data.id==0)
      {
        pcapi.add_address(
          app.globalData.row_member.id,
          thiss.data.name,
          thiss.data.mobile,
          thiss.data.region,
          thiss.data.address,
          thiss.data.is_default,
          function(res)
          {
            if(res.data.code==0)
            {
              util.show_model(res.data.msg);
            }
            else
            {
              util.show_model_and_back(res.data.msg);
            }
          }
        );
      }
      else{
        pcapi.save_address(
          thiss.data.id,
          app.globalData.row_member.id,
          thiss.data.name,
          thiss.data.mobile,
          thiss.data.region,
          thiss.data.address,
          thiss.data.is_default,
          function(res)
          {
            if(res.data.code==0)
            {
              util.show_model(res.data.msg);
            }
            else
            {
              util.show_model_and_back(res.data.msg);
            }
          }
        );
      }
    }
  },
  get_address_by_id:function()
  {
    var thiss=this;
    pcapi.get_address_by_id(
      thiss.data.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              name:res.data.data.name,
              mobile:res.data.data.mobile,
              address:res.data.data.address,
              is_default:parseInt(res.data.data.is_default),
              region:[res.data.data.row_province.name,res.data.data.row_city.name,res.data.data.row_county.name],
            }
          );
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  }
})