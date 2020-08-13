// pages/product/product.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    show_login:false,
    show_panel:false,
    number:1,
    row_flash:null,
    row_productspec:null,
    state:0,//0：未开始 1：进行中 2：结束
    time_hour:0,
    time_minute:0,
    time_second:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    var id=options.id;
    console.log(id);
    this.setData(
      {
        id:id,
      }
    );
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    setInterval(
      function()
      {
        thiss.check_time();
      },
      1000
    )
  },
  //获取用户信息权限
  do_login:function(res)
  {
    var thiss=this;
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
                thiss.get_flash_detail();
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
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data);
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_flash_detail();
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
  get_flash_detail:function()
  {
    //
    var thiss=this;
    pcapi.get_flash_detail(
      thiss.data.id,
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_flash:res.data.data,
            }
          );
          thiss.ini_row_productspec();
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  ini_row_productspec:function()
  {
    var thiss=this;
    if(thiss.data.row_flash.productspec_ids=="0")
    {
      var row_productspec=thiss.data.row_flash.row_product;
      row_productspec.id=0;
      thiss.setData(
        {
          row_productspec:row_productspec,
        }
      );
    }
    else
    {
      for(var i=0;i<thiss.data.row_flash.row_product.rows_productspec.length;i++)
      {
        var row_productspec=thiss.data.row_flash.row_product.rows_productspec[i];
        console.log(thiss.data.row_flash.rows_productspec_id);
        console.log(row_productspec.id);
        if(thiss.data.row_flash.rows_productspec_id.indexOf(row_productspec.id+"")>=0)
        {
          console.log(row_productspec);
          thiss.setData(
            {
              row_productspec:row_productspec,
            }
          );
          i=thiss.data.row_flash.row_product.rows_productspec.length;
        }
      }
    }
    //初始化panel
    thiss.ini_panel();
  },
  ini_panel:function()
  {
    var thiss=this;
    //如果是单规格的话没有必要
    if(parseInt(thiss.data.row_flash.row_product.single_spec)==0)
    {
      var list_spec_ids=this.data.row_productspec.spec_ids.split(',');
      //把所有row_spec的selcted设置成1或者0
      for(var i=0;i<thiss.data.row_flash.row_product.rows_specclass.length;i++)
      {
        var row_specclass=thiss.data.row_flash.row_product.rows_specclass[i];
        for(var j=0;j<row_specclass.rows_spec.length;j++)
        {
          if(list_spec_ids.indexOf(""+row_specclass.rows_spec[j].id)>=0)
          {
            thiss.data.row_flash.row_product.rows_specclass[i].rows_spec[j].selected="1";
          }
          else
          {
            //如果修改list_spec_ids对应分类的ID为现在的ID，是否存在row_flash.productspec_ids里面，如果存在，设置成0，如果不存在设置成-1
            var new_list_spec_ids=this.data.row_productspec.spec_ids.split(',');
            new_list_spec_ids[i]=row_specclass.rows_spec[j].id;
            var new_spec_ids=new_list_spec_ids.join(',');
            var new_productspec_id=-1;
            for(var k=0;k<thiss.data.row_flash.row_product.rows_productspec.length;k++)
            {
              if(thiss.data.row_flash.row_product.rows_productspec[k].spec_ids==new_spec_ids)
              {
                new_productspec_id=thiss.data.row_flash.row_product.rows_productspec[k].id;
              }
            }
            if(thiss.data.row_flash.rows_productspec_id.indexOf(""+new_productspec_id)>=0)
            {
              thiss.data.row_flash.row_product.rows_specclass[i].rows_spec[j].selected="0";
            }
            else
            {
              thiss.data.row_flash.row_product.rows_specclass[i].rows_spec[j].selected="-1";
            }
          }
        }
      }
      thiss.setData(
        thiss.data
      );
    }
  },
  check_time:function()
  {
    var thiss=this;
    if(thiss.data.row_flash!=null)
    {
      var now=new Date().getTime()/1000;
      var stime=new Date(thiss.data.row_flash.stime).getTime()/1000;
      var etime=new Date(thiss.data.row_flash.etime).getTime()/1000;
      if(now<stime)
      {
        thiss.data.state=0;
        //计算
        thiss.data.time_hour=parseInt((stime-now)/3600);
        thiss.data.time_minute=parseInt((stime-now)%3600/60)>9?parseInt((stime-now)%3600/60):"0"+parseInt((stime-now)%3600/60);
        thiss.data.time_second=parseInt((stime-now)%60)>9?parseInt((stime-now)%60):"0"+parseInt((stime-now)%60);
      }
      else if(now>=stime&&now<etime)
      {
        thiss.data.state=1;
        thiss.data.time_hour=parseInt((etime-now)/3600);
        thiss.data.time_minute=parseInt((etime-now)%3600/60)>9?parseInt((etime-now)%3600/60):"0"+parseInt((etime-now)%3600/60);
        thiss.data.time_second=parseInt((etime-now)%60)>9?parseInt((etime-now)%60):"0"+parseInt((etime-now)%60);
      }
      else
      {
        thiss.data.state=2;
      }
      thiss.setData(
        {
          state:thiss.data.state,
          time_hour:thiss.data.time_hour,
          time_minute:thiss.data.time_minute,
          time_second:thiss.data.time_second,
        }
      );
    }
  },
  buy:function()
  {
    var thiss=this;
    if(!thiss.data.show_panel)
    {
      thiss.data.show_panel=true
      thiss.setData(
        {
          show_panel:thiss.data.show_panel,
        }
      );
    }
    else
    {
      //
      if(thiss.data.row_productspec==null)
      {
        wx.showToast({
          title: '请选择规格',
        });
      }
      else
      {
        if(thiss.data.number<1)
        {
          wx.showToast({
            title: '请选择数量',
          });
        }
        else
        {
          var product_id=thiss.data.row_flash.product_id;
          var category_id=thiss.data.row_flash.row_product.category_id;
          var productspec_id=thiss.data.row_productspec.id;
          var price=thiss.data.row_productspec.flash_price;
          var number=thiss.data.number;
          var row_orderlist=new Object();
          row_orderlist.product_id=product_id;
          row_orderlist.category_id=category_id;
          row_orderlist.productspec_id=productspec_id;
          row_orderlist.price=price;
          row_orderlist.number=number;
          var rows_orderlist=new Array();
          rows_orderlist.push(row_orderlist);
          app.globalData.rows_orderlist=rows_orderlist;
          wx.navigateTo({
            url: '/pages/bill_build/bill_build?type=2&detail_id='+thiss.data.id,
          })
        }
      }
    }
  },
  do_nothing:function()
  {},
  select_spec:function(e)
  {
    var thiss=this;
    var spec_id=e.currentTarget.dataset.id;
    var list_spec_ids=this.data.row_productspec.spec_ids.split(',');
    var index_specclass=-1;
    for(var i=0;i<thiss.data.row_flash.row_product.rows_specclass.length;i++)
    {
      var row_specclass=thiss.data.row_flash.row_product.rows_specclass[i];
      for(var j=0;j<row_specclass.rows_spec.length;j++)
      {
        if(parseInt(row_specclass.rows_spec[j].id)==parseInt(spec_id))
        {
          index_specclass=i;
          i=thiss.data.row_flash.row_product.rows_specclass.length;
        }
      }
    }
    if(index_specclass>=0)
    {
      list_spec_ids[index_specclass]=spec_id;
      var new_spec_ids=list_spec_ids.join(',');
      for(var i=0;i<thiss.data.row_flash.row_product.rows_productspec.length;i++)
      {
        if(thiss.data.row_flash.row_product.rows_productspec[i].spec_ids==new_spec_ids)
        {
          thiss.setData(
            {
              row_productspec:thiss.data.row_flash.row_product.rows_productspec[i],
            }
          );
          thiss.ini_panel();
          i=thiss.data.row_flash.row_product.rows_productspec.length;
        }
      }
    }
  },
  add:function()
  {
    //判断row_productspec是否存在，没有的话需要选择规格
    var thiss=this;
    if(thiss.data.row_productspec==null)
    {
      wx.showToast({
        title: '请选择规格',
      });
    }
    else{
      var new_number=thiss.data.number+1;
      var stock=parseInt(thiss.data.row_productspec.stock);
      if(parseInt(thiss.data.row_productspec.flash_limit)>0&&parseInt(thiss.data.row_productspec.flash_limit)<stock)
      {
        stock=parseInt(thiss.data.row_productspec.flash_limit);
      }
      if(new_number<=stock)
      {
        thiss.setData(
          {
            number:new_number,
          }
        );
      }
      else
      {
        thiss.setData(
          {
            number:stock,
          }
        );
      }
    }
  },
  subduce:function()
  {
    //判断row_productspec是否存在，没有的话需要选择规格
    var thiss=this;
    if(thiss.data.row_productspec==null)
    {
      wx.showToast({
        title: '请选择规格',
      });
    }
    else{
      var new_number=thiss.data.number-1;
      if(new_number<0)
      {
        new_number=0;
      }
      var stock=parseInt(thiss.data.row_productspec.stock);
      if(new_number<=stock)
      {
        thiss.setData(
          {
            number:new_number,
          }
        );
      }
      else
      {
        thiss.setData(
          {
            number:stock,
          }
        );
      }
    }
  },
  close_panel:function(res)
  {
    this.setData(
      {
        show_panel:false,
      }
    );
  },
})