var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    
    data: {
        num: 1,
        goods_id: ''
    },
    onLoad : function(options){
        var goods_id = options.goods_id
        this.setData({
            goods_id: goods_id
        })
        var self = this;
        /*商品信息*/
        wx.request({
            url:"https://www.zouzoubar.com/mobile/index.php?act=goods&op=goods_detail",
            method:"get",
            data:{goods_id:goods_id},
            success:function(res){
                var data = res.data.datas;
                self.setData({
                    goods_img: data.goods_image_arr,
                    goods_info: data.goods_info,
                    spec_list: data.spec_list,
                    goods_commend: data.goods_commend_list,
                    store_info: data.store_info
                })
            }
        })
        /*商品详情*/
        wx.request({
            url: "https://www.zouzoubar.com/mobile/index.php?act=goods&op=goods_body",
            method: "GET",
            data: {goods_id:goods_id},
            success: function(result){
                var data = result.data;

                WxParse.wxParse('html', data, self);
            }
        })
    },
    wxParseImgTap: function (e){
      var _this = this
      WxParse.wxParseImgTap(e, _this)
    },
    wxParseImgLoad: function (e){
      var _this = this
      WxParse.wxParseImgLoad(e, _this)
    },
    buy : function(){
        var self = this;
        var animation = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        })
        var bgLside = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        }) 
        var bgRside = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        })
        self.animation = animation
        self.bgLside = bgLside
        self.bgRside = bgRside

        animation.translateY(-350).step()
        bgLside.translateX('100%').step()
        bgRside.translateX('-100%').step()

        self.setData({
            buyModel : animation.export(),
            buyBgLside : bgLside.export(),
            buyBgRside : bgRside.export()
        })
    },
    buyBg : function(){
        var self = this;
        var animation = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        })
        var bgLside = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        }) 
        var bgRside = wx.createAnimation({
             duration: 500,
             timingFunction: 'ease',
        })
        self.animation = animation
        self.bgLside = bgLside
        self.bgRside = bgRside

        animation.translateY(0).step()
        bgLside.translateX('-100%').step()
        bgRside.translateX('100%').step()

        self.setData({
            buyModel : animation.export(),
            buyBgLside : bgLside.export(),
            buyBgRside : bgRside.export()
        })
        
    },
    import :function(e){
        var val = e.detail.value;
        this.setData({
            num : val
        })
    },
    minus : function(e){

        var val = Number(e.currentTarget.dataset.num) - 1;
        if(val < 1){
            return;
        }
        this.setData({
            num : val
        })
    },
    add : function(e){
        var val = Number(e.currentTarget.dataset.num) + 1;
        this.setData({
            num : val
        })
    },
    /*购买商品种类*/
    buyType : function(e){
        var self = this;

        /*选择种类改变样式*/
        var id = e.currentTarget.dataset.id;
        var goods_id = e.currentTarget.id;
        self.setData({
            val: id,
            goods_id: goods_id
        })

        /*选择种类改变数据*/
        
        wx.request({
            url:"https://www.zouzoubar.com/mobile/index.php?act=goods&op=goods_detail",
            method:"get",
            data:{goods_id:goods_id},
            success:function(res){
                var data = res.data.datas;
                self.setData({
                    goods_img: data.goods_image_arr,
                    goods_info: data.goods_info,
                    spec_list: data.spec_list,
                    goods_commend: data.goods_commend_list,
                    store_info: data.store_info
                })
            }
        })

    },
    /*加入购物车*/
    addCart : function(options){
        var goods_id = this.data.goods_id;
        var self = this;
        var key = app.loginData.key;
        var quantity = this.data.num;
        wx.request({
            url:"https://www.zouzoubar.com/mobile/index.php?act=member_cart&op=cart_add",
            header: { "content-type": "application/x-www-form-urlencoded" },
            method:"POST",
            data:util.json2Form({goods_id:goods_id,quantity:quantity,key:key}),
            success:function(res){
                var state = res.data.datas;
                if(state){
                    wx.showModal({
                        title: '成功加入购物车',
                        showCancel: false
                    })
                }else{
                    wx.showModal({
                        title: '加入购物车失败',
                        showCancel: false
                    })
                }
            }
        })
    }
    
})