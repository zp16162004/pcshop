// components/cash_out/cash_out.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    money:Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    m:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change_m:function(e)
    {
      console.log(e);
      this.setData(
        {
          m:e.detail.value,
        }
      );
    },
    cancel:function(e)
    {
      this.triggerEvent("confirm",
        {
          code:0,
          msg:'success',
          money:this.data.m,
        },
        {}
      );
    },
    submit:function(e)
    {
      this.triggerEvent("confirm",
        {
          code:1,
          msg:'success',
          money:this.data.m,
        },
        {}
      );
    }
  }
})
