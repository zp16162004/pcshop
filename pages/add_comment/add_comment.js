// pages/add_comment/add_comment.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    rows_star:[1,2,3,4,5],
    order_id:0,
    orderlist_id:0,
    row_order:null,
    show_login:false,
    star_count:0,
    service_count:0,
    content:'',
    imgs:[],
    temp_paths:[],
    compressed_paths:[],
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
    if(options.order_id!=null)
    {
      thiss.setData(
        {
          order_id:options.order_id,
        }
      );
    };
    if(options.orderlist_id!=null)
    {
      thiss.setData(
        {
          orderlist_id:options.orderlist_id,
        }
      );
    };
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
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.refresh_member();
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
                thiss.setData(
                  {
                    p:1,
                    row_member:res.data.data,
                  }
                );
                thiss.get_order_detail();
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
  refresh_member:function()
  {
    var thiss=this;
    pcapi.refresh_member(
      function(res)
      {
        console.log(res);
        thiss.setData(
          {
            p:1,
            row_member:res.data.data,
          }
        );
        thiss.get_order_detail();
      }
    );
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
  get_order_detail:function()
  {
    var thiss=this;
    pcapi.get_order_detail(
      thiss.data.order_id,
      function(res)
      {
        console.log(res);
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_order:res.data.data,
            }
          );
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  },
  change_service_count:function(e)
  {
    var count=parseInt(e.currentTarget.dataset.count);
    var thiss=this;
    thiss.setData(
      {
        service_count:count,
      }
    );
  },
  change_star_count:function(e)
  {
    var count=parseInt(e.currentTarget.dataset.count);
    var thiss=this;
    thiss.setData(
      {
        star_count:count,
      }
    );
  },
  change_content:function(e)
  {
    console.log(e.detail.value);
    var thiss=this;
    thiss.setData(
      {
        content:e.detail.value,
      }
    );
  },
  add_img:function()
  {
    var thiss=this;
    thiss.setData(
      {
        temp_paths:[],
        compressed_paths:[],
      }
    );
    wx.chooseImage({
      count: 9,
      sizeType: [],
      sourceType: [],
      success: (result) => {
        console.log(result);
        thiss.setData(
          {
            temp_paths:result.tempFilePaths,
          }
        );
        thiss.compress_imgs();
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  compress_imgs:function()
  {
    var thiss=this;
    console.log("临时路径");
    console.log(thiss.data.temp_paths);
    if(thiss.data.temp_paths.length>0)
    {
      wx.compressImage({
        src: thiss.data.temp_paths[0],
        success:function(res)
        {
          thiss.data.compressed_paths.push(res.tempFilePath);
          thiss.data.temp_paths.splice(0,1);
          thiss.compress_imgs();
        },
        fail:function(res)
        {
          wx.showToast({
            title: '图片压缩失败',
          })
        }
      })
    }
    else
    {
      console.log('压缩后图片路径');
      console.log(thiss.data.compressed_paths);
      thiss.upload_imgs();
    }
  },
  upload_imgs:function()
  {
    var thiss=this;
    console.log('开始上传图片');
    if(thiss.data.compressed_paths.length>0)
    {
      pcapi.upload_img(
        thiss.data.compressed_paths[0],
        function(res)
        {
          res.data=JSON.parse(res.data);
          console.log(res.data);
          if(res.data.code==1)
          {
            wx.showToast({
              title: res.data.msg,
            })
          }
          else
          {
            thiss.data.compressed_paths.splice(0,1);
            thiss.data.imgs.push(res.data.data);
            thiss.upload_imgs();
          }
        }
      );
    }
    thiss.setData(
      {
        imgs:thiss.data.imgs,
      }
    );
  },
})