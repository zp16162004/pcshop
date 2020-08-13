// pages/product_group/product_group.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    grouplist_id:0,//如果开团的话=0，如果参加别人的团的话>0
    show_login:false,
    show_panel:false,
    number:1,
    row_group:null,
    row_productspec:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    console.log(options);
    this.setData(
      {
        id:options.id,
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
        thiss.ini_time_remain();
      },
      1000
    )
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
                thiss.get_group_detail();
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
        console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_group_detail();
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
  get_group_detail:function()
  {
    //
    var thiss=this;
    pcapi.get_group_detail(
      thiss.data.id,
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_group:res.data.data,
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
  ini_time_remain:function()
  {
    var thiss=this;
    if(thiss.data.row_group!=null)
    {
      for(var i=0;i<thiss.data.row_group.rows_grouplist.length;i++)
      {
        var row_grouplist=thiss.data.row_group.rows_grouplist[i];
        var edate=row_grouplist.edate;
        var etime=parseInt(new Date(edate).getTime/1000-new Date().getTime()/1000);
        var remain_hour=parseInt(etime/3600);
        var remain_minute=parseInt(etime%3600/60);
        var remain_second=parseInt(etime%60);
        var time_remain=remain_hour+":"+remain_minute+":"+remain_second;
        thiss.data.row_group.rows_grouplist[i].etime=etime;
        thiss.data.row_group.rows_grouplist[i].time_remain=time_remain;
        thiss.setData(
          {
            row_group:thiss.data.row_group,
          }
        );
      }
    }
  },
  ini_row_productspec:function()
  {
    var thiss=this;
    if(thiss.data.row_group.productspec_ids=="0")
    {
      var row_productspec=thiss.data.row_group.row_product;
      row_productspec.id='0';
      thiss.setData(
        {
          row_productspec:row_productspec,
        }
      );
      console.log('row_productspec');
      console.log(row_productspec);
    }
    else
    {
      for(var i=0;i<thiss.data.row_group.row_product.rows_productspec.length;i++)
      {
        var row_productspec=thiss.data.row_group.row_product.rows_productspec[i];
        console.log(thiss.data.row_group.rows_productspec_id);
        console.log(row_productspec.id);
        if(thiss.data.row_group.rows_productspec_id.indexOf(row_productspec.id+"")>=0)
        {
          console.log(row_productspec);
          thiss.setData(
            {
              row_productspec:row_productspec,
            }
          );
          i=thiss.data.row_group.row_product.rows_productspec.length;
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
    if(parseInt(thiss.data.row_group.row_product.single_spec)==0)
    {
      var list_spec_ids=this.data.row_productspec.spec_ids.split(',');
      //把所有row_spec的selcted设置成1或者0
      for(var i=0;i<thiss.data.row_group.row_product.rows_specclass.length;i++)
      {
        var row_specclass=thiss.data.row_group.row_product.rows_specclass[i];
        for(var j=0;j<row_specclass.rows_spec.length;j++)
        {
          if(list_spec_ids.indexOf(""+row_specclass.rows_spec[j].id)>=0)
          {
            thiss.data.row_group.row_product.rows_specclass[i].rows_spec[j].selected="1";
          }
          else
          {
            //如果修改list_spec_ids对应分类的ID为现在的ID，是否存在row_group.productspec_ids里面，如果存在，设置成0，如果不存在设置成-1
            var new_list_spec_ids=this.data.row_productspec.spec_ids.split(',');
            new_list_spec_ids[i]=row_specclass.rows_spec[j].id;
            var new_spec_ids=new_list_spec_ids.join(',');
            var new_productspec_id=-1;
            for(var k=0;k<thiss.data.row_group.row_product.rows_productspec.length;k++)
            {
              if(thiss.data.row_group.row_product.rows_productspec[k].spec_ids==new_spec_ids)
              {
                new_productspec_id=thiss.data.row_group.row_product.rows_productspec[k].id;
              }
            }
            if(thiss.data.row_group.rows_productspec_id.indexOf(""+new_productspec_id)>=0)
            {
              thiss.data.row_group.row_product.rows_specclass[i].rows_spec[j].selected="0";
            }
            else
            {
              thiss.data.row_group.row_product.rows_specclass[i].rows_spec[j].selected="-1";
            }
          }
        }
      }
      thiss.setData(
        thiss.data
      );
    }
  },
})