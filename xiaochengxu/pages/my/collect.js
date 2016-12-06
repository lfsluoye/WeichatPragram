/** pages/my/collect.js */
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        winWidth: 0,  
        winHeight: 0, 
        hidden: true,
        clearhidden: true,
        favorites_list: [],
        curpage: '',
        hasmore: '',
        goods_id: 1
    },
    onLoad: function() {
        var _this = this;
         /* 获取系统信息 */
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    winWidth: res.windowWidth,  
                    winHeight: res.windowHeight  
                });
            }
        });
        var key = app.loginData.key;
        _this.getFavorites(key);
        this.setData({
            key: key
        })
    },

    getFavorites: function(key) {
    var _this = this;
        _this.setData({
            hidden: false,
            clearhidden: false
        })
        wx.request({
            method: 'POST',
            url: "https://www.zouzoubar.com/mobile/index.php?act=member_favorites&op=favorites_list",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data:util.json2Form({key: key}),
            success: function(res) {
                _this.setData({
                    hidden: true,
                    // clearhidden: true,
                    favorites_list: res.data.datas.favorites_list
                })
                 /* 判断是否有列表 */
                if(!res.data.datas.favorites_list.length){
                    _this.setData({
                        clearhidden: false
                    })
                }else{
                    _this.setData({
                        clearhidden: true
                    })
                }
            }
        })
    },

    /** 是否删除商品 */
    actionsheet: function(options){
        var index = options.currentTarget.dataset.id;
        var fav_id = this.data.favorites_list[index].fav_id;
        var that = this;
        var key = that.data.key;   //获取key
        that.setData({
            actionSheetHidden: !that.data.actionSheetHidden
        });
        wx.showActionSheet({
            itemList: ['确定删除该商品吗？','确定'],
            success: function(res) {
                if(!res.cancel){
                    wx.request({
                        method: 'POST',
                        url: "https://www.zouzoubar.com/mobile/index.php?act=member_favorites&op=favorites_del",
                        header: { "content-type": "application/x-www-form-urlencoded" },
                        data:util.json2Form({fav_id: fav_id,key: key}),
                        success: function(res) {
                            that.setData({
                                favorites_list: res.data.datas.favorites_list
                            })
                            that.onLoad();   //在页面上删除
                        }
                    })
                }
            }
        })
    },
    
    /** 收藏商品分页 */
    scrolltolower: function(options){
        var that = this;
        console.log("dfdfdgfdhffffffffffff")
        console.log(options);
        var curpage = that.data.curpage;
        var hasmore = that.data.hasmore;
        var key = that.data.key;   //获取key
        curpage += 1;
        wx.request({
          url: 'https://www.zouzoubar.com/mobile/index.php?act=member_favorites&op=favorites_list',
          data:util.json2Form({kay: key,curpage: curpage,goods_id: that.data.goods_id}),
          method: 'POST', 
          success: function(res){
            // success
            var data = res.data.datas;
             that.setData({
                    favorites_list: that.data.favorites_list.concat(data.favorites_list)
             });
            　if(!res.data.hasmore){
                    hasmore = 0;
            　}    
            console.log(curpage);
            console.log(data.favorites_list);         
          }
        })
    },
    
    loadingChange: function () {
        this.setData({
            hidden: true
        })
    },
})