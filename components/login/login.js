// components/login/login.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel:function()
    {
      wx.navigateBack({
        delta: 1,
      });
    },
    confirm:function(res)
    {
      console.log(res.detail.userInfo);
      app.globalData.userinfo=res.detail.userInfo;
      this.triggerEvent("confirm",
        {
          code:1,
          msg:'success'
        },
        {}
      );
    }
  }
})
