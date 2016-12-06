var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
    data: {
        title: ''
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.title
        })
    },
    onLoad: function(option) {
        var _this = this
        wx.request({
            url: 'https://www.zouzoubar.com/mobile/index.php?act=article&op=article_show',
            method: 'GET',
            data: {
                article_id: option.id
            },
            success: function(res) {
                var data = res.data.datas;
                _this.setData({
                    title: data.article_title
                })
                var content = data.article_content;
                WxParse.wxParse('html', content, _this)
            }
        })
    },
    wxParseImgTap: function(e){
      var _this = this
      WxParse.wxParseImgTap(e, _this)
    },
    wxParseImgLoad: function (e){
      var _this = this
      WxParse.wxParseImgLoad(e, _this)
    }
})
