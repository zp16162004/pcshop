// pages/add_orderrefund/add_orderrefund.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'',
    order_id:0,
    row_order:null,
    rows_reason:[],
    index_reason:0,
    config:[],
    show_login:false,
    refund_money:0,
    fnote:'',
    imgs:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
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
    thiss.get_config();
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
  get_config:function()
  {
    var thiss=this;
    pcapi.get_config("",
      function(res)
      {
        thiss.setData(
          {
            config:res.data.data,
          }
        );
        if(thiss.data.config.refund_reason!=null&&thiss.data.config.refund_reason!='')
        {
          var rows_reason=thiss.data.config.refund_reason.split(',');
          thiss.setData(
            {
              rows_reason:rows_reason,
            }
          );
        }
        console.log(thiss.data.config);
      }
    );
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
          //初始化orderlist里面的count_refund,selected
          for(var i=0;i<thiss.data.row_order.rows_orderlist.length;i++)
          {
            thiss.data.row_order.rows_orderlist[i].count_refund=thiss.data.row_order.rows_orderlist[i].can_refund;
            thiss.data.row_order.rows_orderlist[i].selected=0;
          }
          thiss.setData(
            {
              row_order:thiss.data.row_order,
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
  delete_img:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    thiss.data.imgs.splice(index,1);
    thiss.setData(
      {
        imgs:thiss.data.imgs,
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
      //获取文件类型
      wx.getImageInfo({
        src: thiss.data.compressed_paths[0],
        success:function(res)
        {
          console.log(res);
          pcapi.upload_img(
            thiss.data.compressed_paths[0],
            res.type,
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
        },
        fail:function(res)
        {
          util.show_model("获取图片格式失败，图片上传终止");
        }
      })
    }
    thiss.setData(
      {
        imgs:thiss.data.imgs,
      }
    );
  },
  change_fnote:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        fnote:e.detail.value,
      }
    );
  },
  change_index_reason:function(e)
  {
    var thiss=this;
    console.log(e);
    thiss.setData(
      {
        index_reason:e.detail.value,
      }
    );
  },
  change_selected:function(e)
  {
    var index=parseInt(e.currentTarget.dataset.index);
    var thiss=this;
    thiss.data.row_order.rows_orderlist[index].selected=1;
    for(var i=0;i<thiss.data.row_order.rows_orderlist.length;i++)
    {
      if(i==index)
      {
        thiss.data.row_order.rows_orderlist[index].selected=1;
      }
      else
      {
        thiss.data.row_order.rows_orderlist[index].selected=0;
      }
    }
    thiss.setData(
      {
        row_order:thiss.data.row_order,
      }
    );
    thiss.ini_refund_money();
  },
  ini_refund_money:function()
  {
    var thiss=this;
    var refund_money=0;
    for(var i=0;i<thiss.data.row_order.rows_orderlist.length;i++)
    {
      if(thiss.data.row_order.rows_orderlist[i].selected==1)
      {
        console.log((parseFloat(thiss.data.row_order.rows_orderlist[i].price)*parseFloat(thiss.data.row_order.rows_orderlist[i].count_refund)).toFixed(2));
        refund_money=(refund_money+parseFloat(thiss.data.row_order.rows_orderlist[i].price)*parseFloat(thiss.data.row_order.rows_orderlist[i].count_refund)*100/100).toFixed(2);
        console.log(refund_money);
      }
    }
    thiss.setData(
      {
        refund_money:refund_money,
      }
    );
  },
  add:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_orderlist=thiss.data.row_order.rows_orderlist[index];
    if(row_orderlist.count+1>row_orderlist.can_refund)
    {
      thiss.data.row_order.rows_orderlist[index].count_refund=thiss.data.row_order.rows_orderlist[index].can_refund;
    }
    else{
      thiss.data.row_order.rows_orderlist[index].count_refund=thiss.data.row_order.rows_orderlist[index].count_refund+1;
    }
    thiss.setData(
      {
        row_order:thiss.data.row_order,
      }
    );
    thiss.ini_refund_money();
  },
  reduce:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_orderlist=thiss.data.row_order.rows_orderlist[index];
    if(row_orderlist.count-1<=0)
    {
      thiss.data.row_order.rows_orderlist[index].count_refund=0;
    }
    else{
      thiss.data.row_order.rows_orderlist[index].count_refund=thiss.data.row_order.rows_orderlist[index].count_refund-1;
    }
    thiss.setData(
      {
        row_order:thiss.data.row_order,
      }
    );
    thiss.ini_refund_money();
  },
  submit:function()
  {
    var thiss=this;
    var reason=thiss.data.rows_reason[thiss.data.index_reason];
    if(reason=='')
    {
      wx.showToast({
        title: '请选择退款原因',
      })
      return;
    }
    if(thiss.data.refund_money<=0)
    {
      wx.showToast({
        title: '请选择退款商品，退款金额不可为0',
      })
      return;
    }
    var index=-1;
    for(var i=0;i<thiss.data.row_order.rows_orderlist.length;i++)
    {
      if(thiss.data.row_order.rows_orderlist[i].selected==1)
      {
        index=i;
      }
    }
    if(index<0)
    {
      wx.showToast({
        title: '请选择退款商品，退款金额不可为0',
      })
      return;
    }
    pcapi.add_orderrefund(
      app.globalData.row_member.id,
      thiss.data.row_order.id,
      thiss.data.row_order.rows_orderlist[index].id,
      thiss.data.row_order.rows_orderlist[index].count_refund,
      thiss.data.refund_money,
      reason,
      thiss.data.fnote,
      thiss.data.imgs.join(','),
      function(res)
      {
        if(res.data.code==1)
        {
          if(res.data.ids_template!=null)
          {
            util.apply_template(thiss.data.systeminfo,res.data.ids_template,
              function()
              {
                console.log("请求权限完成");
                util.show_model_and_back(res.data.msg);
              }
            );
          }
          else
          {
            util.show_model_and_back(res.data.msg);
          }
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  }
})