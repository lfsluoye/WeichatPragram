/** index.js */
var app = getApp();
Page({
    data: {
        userInfo:{},
    },
    onLoad: function (options) {
        //console.log('onLoad')
        var that = this;
        // console.log(options);
        wx.request({
            url:'https://www.zouzoubar.com/mobile/index.php?act=article&op=article_list',
            data:{ac_id:7},
            success : function(res){
                var data =res.data.datas;                                
                that.setData({
                    article_list : data.article_list
                    });
                    console.log(res);
                 }
              });
      },
      aboutTap: function(e){
          var that = this;
          console.log(e);
      }
});
