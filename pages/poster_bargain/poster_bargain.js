// pages/poster_bargain/poster_bargain.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    bargainlist_id:0,
    img:null,
    ctx:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data.systeminfo);
    console.log(this.data.menu_rect);
    this.setData(
      this.data
    );
    if(options.id!=null)
    {
      this.setData(
        {
          id:options.id,
        }
      );
    }
    if(options.bargainlist_id!=null)
    {
      this.setData(
        {
          bargainlist_id:options.bargainlist_id,
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
    this.get_bargain_detail();
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
  get_bargain_detail:function()
  {
    var thiss=this;
    pcapi.get_bargain_detail(
      thiss.data.id,
      app.globalData.row_member.id,
      thiss.data.bargainlist_id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_bargain:res.data.data,
            }
          );
          thiss.ini_canvas();
          //下载产品图片
          thiss.show_img();
          //获取小程序码
          thiss.get_qrcode();
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  ini_canvas:function()
  {
    var thiss=this;
    if(thiss.data.img!=null)
    {
      thiss.data.ctx = wx.createCanvasContext('poster');
      var ctx=thiss.data.ctx;
      ctx.setFillStyle('white');
      ctx.fillRect(0,0,util.rpx2px(690,thiss.data.systeminfo),util.rpx2px(1227,thiss.data.systeminfo));
      var width=690;
      var height=1227;
      var padding_left=45;
      var padding_top=20;
      var max_font_size=40;
      var max_line_height=60;
      var big_font_size=32;
      var big_line_height=50;
      var normal_font_size=22;
      var normal_line_height=33;
      var small_font_size=20;
      var small_line_height=30;
      //商品名称
      ctx.setFillStyle('black');
      var name=thiss.data.row_bargain.row_product.name;
      ctx.font="normal bold "+util.rpx2px(big_font_size,thiss.data.systeminfo)+"px 微软雅黑";
      var name_white=ctx.measureText(name);
      var line1="";
      var line2="";
      if(name_white.width>util.rpx2px(width-2*padding_left,thiss.data.systeminfo))
      {
        while(ctx.measureText(name).width>util.rpx2px(width-2*padding_left,thiss.data.systeminfo))
        {
          name=name.substr(0,name.length-1);
        }
        line1=name;
        line2=thiss.data.row_bargain.row_product.name.substr(line1.length);
        if(ctx.measureText(line2).width>util.rpx2px(width-2*padding_left,thiss.data.systeminfo))
        {
          while(ctx.measureText(line2+"...").width>util.rpx2px(width-2*padding_left,thiss.data.systeminfo))
          {
            line2=line2.substr(0,line2.length-1);
          }
          line2=line2+'...';
        }
      }
      else{
        line1=name;
        line2="";
      }
      console.log('padding_top:'+util.rpx2px(padding_top,thiss.data.systeminfo));
      ctx.fillText(line1,util.rpx2px(padding_left,thiss.data.systeminfo),util.rpx2px(padding_top+big_line_height,thiss.data.systeminfo));
      ctx.fillText(line2,util.rpx2px(padding_left,thiss.data.systeminfo),util.rpx2px(padding_top+2*big_line_height,thiss.data.systeminfo));
      //填写价格
      ctx.font="normal bold "+util.rpx2px(normal_font_size,thiss.data.systeminfo)+"px 微软雅黑";
      ctx.setFillStyle("#f10b0b");
      ctx.fillText("￥",util.rpx2px(padding_left,thiss.data.systeminfo),util.rpx2px(padding_top+2*big_line_height+max_line_height,thiss.data.systeminfo));
      ctx.font="normal bold "+util.rpx2px(max_font_size,thiss.data.systeminfo)+"px 微软雅黑";
      ctx.fillText(""+thiss.data.row_bargain.price,util.rpx2px(padding_left+2*small_font_size,thiss.data.systeminfo),util.rpx2px(padding_top+2*big_line_height+max_line_height,thiss.data.systeminfo));
      //填写bargain_left
      var y=util.rpx2px(padding_top+2*big_line_height+max_line_height+normal_line_height,thiss.data.systeminfo);
      var x=util.rpx2px(padding_left,thiss.data.systeminfo);
      ctx.font="normal bold "+util.rpx2px(normal_font_size,thiss.data.systeminfo)+"px 微软雅黑";
      ctx.setFillStyle("#656565");
      ctx.fillText("还差"+thiss.data.row_bargain.bargain_left+"元即可砍价成功",x,y);
      //画产品图片
      y=y+util.rpx2px(30,thiss.data.systeminfo);
      var width=util.rpx2px(width-2*padding_left,thiss.data.systeminfo);
      var ctx=thiss.data.ctx;
      ctx.drawImage(thiss.data.img.path,x,y,width,width);
      //小程序介绍
      y=y+width+util.rpx2px(20+small_line_height,thiss.data.systeminfo);
      ctx.setFillStyle("#545454");
      ctx.font="normal normal "+util.rpx2px(small_font_size,thiss.data.systeminfo)+"px 微软雅黑";
      ctx.fillText("长按识别或扫描二维码进入",x+(width-ctx.measureText("长按识别或扫描二维码进入").width)/2,y);
      //小程序码
      ctx.draw();
    }
  },
  show_img:function()
  {
    var thiss=this;
    wx.getImageInfo({
      src: thiss.data.row_bargain.row_product.img,
      success:function(res)
      {
        console.log(res);
        thiss.setData(
          {
            img:res,
          }
        );
        //draw_img
        thiss.ini_canvas();
      },
    })
  },
  get_qrcode:function()
  {
    //获取小程序码
  },
})