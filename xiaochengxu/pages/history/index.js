/** pages/history/index */
var app = getApp();
Page({
    data: {
        hidden: true,
        goodsbrowse_list: [],
        clearhidden: true
    },

    onLoad: function () {
        var that = this;
        var key = app.loginData.key;
        that.getGoodsbrowseList(key);
    },

    getGoodsbrowseList: function(key){
        var that = this;
        that.setData({
            hidden: false,
            clearhidden: false
        })
        wx.request({
            method: 'GET',
            url:'https://www.zouzoubar.com/mobile/index.php?act=member_goodsbrowse&op=browse_list',
            data: {key: key},
            success : function(res){
                var data = res.data.datas;
                console.log('11111')
                console.log(res);
                that.setData({
                    hidden: true,
                    // clearhidden: true,
                    goodsbrowse_list: data.goodsbrowse_list
                });
                // console.log(res.data.datas.goodsbrowse_list);
            }
        });
    },

    actionsheet: function(){
        var that = this;
        that.setData({
            actionSheetHidden: !that.data.actionSheetHidden
        })
          wx.showActionSheet({
            itemList: ['确定清空历史记录吗？','确定'],
            success: function(res) {
                if(!res.cancel){

                }
            }
        })
    },
    
    loadingChange: function () {
        this.setData({
            hidden: true
        })
    }

})