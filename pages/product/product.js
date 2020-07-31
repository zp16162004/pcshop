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
    row_productspec:null,//选中的规格信息
    number:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
                //重新获取商品详情
                this.get_product_info();
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
    this.get_product_info();
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
  get_product_info:function()
  {
    //
    var thiss=this;
    var member_id=0;
    if(app.globalData.row_member!=null)
    {
      member_id=app.globalData.row_member.id;
    }
    pcapi.get_product_info(thiss.data.id,member_id,
        function(res)
        {
          //当商品是单规格的时候，row_productspec=row_product
          if(parseInt(res.data.data.single_spec)==1)
          {
            thiss.data.row_productspec=res.data.data;
            thiss.data.row_productspec.spec_img=thiss.data.row_productspec.img;
            thiss.data.row_productspec.id=0;
          }
          thiss.setData(
            {
              row_product:res.data.data,
              row_productspec:thiss.data.row_productspec,
            }
          );
          console.log(thiss.data.row_product);
        }
      );
  },
  add_collection:function()
  {
    var thiss=this;
    var product_id=thiss.data.id;
    var member_id=0;
    if(app.globalData.row_member!=null)
    {
      member_id=app.globalData.row_member.id;
    }
    pcapi.add_collection(
      product_id,
      member_id,
      function(res)
      {
        console.log(res);
        if(res.data.code==1)
        {
          thiss.data.row_product.collected=1;
          thiss.setData(
            {
              row_product:thiss.data.row_product,
            }
          );
        }
      }
    );
  },
  add_cart:function()
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
          var member_id=app.globalData.row_member.id;
          var product_id=thiss.data.id;
          var productspec_id=thiss.data.row_productspec.id;
          var number=thiss.data.number;
          pcapi.add_cart(
            member_id,
            product_id,
            productspec_id,
            number,
            function(res)
            {
              wx.showToast({
                title: res.data.msg,
              });
              thiss.setData(
                {
                  show_panel:false,
                }
              );
              thiss.get_product_info();
            }
          );
        }
      }
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
          var product_id=thiss.data.id;
          var productspec_id=thiss.data.row_productspec.id;
          var number=thiss.data.number;
          var row_orderlist=new Object();
          row_orderlist.product_id=product_id;
          row_orderlist.productspec_id=productspec_id;
          row_orderlist.number=number;
          var rows_orderlist=new Array();
          rows_orderlist.push(row_orderlist);
          app.globalData.rows_orderlist=rows_orderlist;
          wx.navigateTo({
            url: '/pages/bill_build/bill_build',
          })
        }
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
  do_nothing:function()
  {},
  select_spec:function(e)
  {
    var thiss=this;
    var spec_id=e.currentTarget.dataset.id;
    console.log(spec_id);
    var row_product=thiss.data.row_product;
    //获取specclass_id
    var index_specclass=-1;
    for(var i=0;i<row_product.rows_specclass.length;i++)
    {
      var row_specclass=row_product.rows_specclass[i];
      for(var j=0;j<row_specclass.rows_spec.length;j++)
      {
        var row_spec=row_specclass.rows_spec[j];
        if(row_spec.id==spec_id)
        {
          index_specclass=i;
        }
      }
    }
    //把当前specclass里面的spec.selected=0
    if(index_specclass>=0)
    {
      for(var j=0;j<row_product.rows_specclass[index_specclass].rows_spec.length;j++)
      {
        var row_spec=row_product.rows_specclass[index_specclass].rows_spec[j];
        console.log(row_spec.id+":"+spec_id);
        if(row_spec.id==spec_id)
        {
          row_product.rows_specclass[index_specclass].rows_spec[j].selected="1";
        }
        else
        {
          row_product.rows_specclass[index_specclass].rows_spec[j].selected="0";
        }
      }
    }
    thiss.setData(
      {
        row_product:row_product
      }
    );
    console.log(row_product);
    //遍历判断是否已经选中
    var spec_ids="";
    for(var i=0;i<row_product.rows_specclass.length;i++)
    {
      var row_specclass=row_product.rows_specclass[i];
      for(var j=0;j<row_specclass.rows_spec.length;j++)
      {
        var row_spec=row_specclass.rows_spec[j];
        if(row_spec.selected!=null&&row_spec.selected=="1")
        {
          if(spec_ids!="")
          {
            spec_ids=spec_ids+",";
          }
          spec_ids=spec_ids+row_spec.id;
        }
      }
    }
    //遍历row_product.rows_productspec
    for(var i=0;i<row_product.rows_productspec.length;i++)
    {
      var row_productspec=row_product.rows_productspec[i];
      console.log(row_productspec.spec_ids+":"+spec_ids);
      if(row_productspec.spec_ids==spec_ids)
      {
        var stock=parseInt(row_productspec.stock);
        var new_number=1;
        if(stock==0)
        {
          new_number=0;
        }
        thiss.setData(
          {
            row_productspec:row_productspec,
            number:new_number,
          }
        );
      }
    }
    console.log(thiss.data.row_productspec);
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
})