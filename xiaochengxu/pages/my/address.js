/** pages/my/address.js */
var util = require('../../utils/util.js');
var app = getApp()
Page({
    data: {
        hidden: true,
        address: 1
    },
    onLoad: function() {
        var self = this;
        var key = app.loginData.key;
        self.getAddress(key);
        this.setData({
            key: key
        })
    },

    getAddress: function(key) {
        var self = this;
        var address = this.data.address;
        self.setData({
            hidden: false
        })
        wx.request({
            method: 'POST',
            url: "https://www.zouzoubar.com/mobile/index.php?act=member_address&op=address_list",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data:util.json2Form({key: key,address: 1}),
            success: function(res) {
                self.setData({
                    hidden: true,
                    address: res.data.datas.address
                })      
            }
        })
    },

    /** 删除 */
    deleteAddress: function(options){
        var index = options.currentTarget.dataset.id;
        var address_id = this.data.address[index].address_id;
        var that = this;
        var key = that.data.key;   //获取key
        wx.showActionSheet({
            itemList: ['确定删除收货地址吗？','确定'],
            success: function(res) {
                if(!res.cancel){
                    wx.request({
                        method: 'POST',
                        url: "https://www.zouzoubar.com/mobile/index.php?act=member_address&op=address_del",
                        header: { "content-type": "application/x-www-form-urlencoded" },
                        data:util.json2Form({address_id: address_id,key: key}),
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

    /* 编辑 */
    editAddress: function(options){
        var that = this;
        console.log(options);
        var index = options.currentTarget.dataset.id;
        var address_id = this.data.address[index].address_id;
        var key = that.data.key;   //获取key
    },
    
    loadingChange: function () {
        this.setData({
            hidden: true
        })
    }

})