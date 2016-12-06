/* index.js */
var app = getApp();
var curpage = [];
var hasmore = []; 
var gcalist = [];
var classifyNum = 1;
Page({
    data: {
        winWidth: 0,  
        winHeight: 0,  
        // tab切换  
        currentTab: 0,
        currentGcaId: 0,
        goods_list: [],
        gca_parent_id: 0,
        more: '',
        gca_id: 0,
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            currentTab: options.current,
            gca_id: options.gca_id,
            gca_parent_id: options.gca_parent_id
        })
        /* 获取系统信息 */
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,  
                    winHeight: res.windowHeight
                });
            }
        });
        wx.request({
            url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoodsByCategory',
            data:{
                gca_id: that.data.gca_id,
                gca_parent_id: that.data.gca_parent_id
            },
            success : function(res){
                var data = res.data.datas;
                classifyNum = data.category_list.length;
                that.setData({
                    category_list: data.category_list,
                    goods_list: data.goods_list
                });  
                for(var i=1;i<=classifyNum;i++) {
                    curpage[i] = 1;
                    hasmore[i] = 1;
                    gcalist[i] = data.category_list[i-1]['gca_id'];
                    if(!res.data.hasmore){
                        hasmore[i] = 0;
                    }
                }                        
              }
          });
      },

    /* 滑动切换 */
    bindChange: function(e) {
       for(var i=1;i<=classifyNum;i++) {
           curpage[i] = 1;
           hasmore[i] = 1;
       }   
       var that = this;
       var index = parseInt(e.detail.current) + 1;
       var gca_id = gcalist[index];  //关联数据
       that.setData({ 
           currentTab: e.detail.current
       }); 
      wx.request({
          method:'GET',
          url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoodsByCategory',
          data:{
              gca_id: gca_id,
              gca_parent_id: that.data.gca_parent_id,
            //   curpage: curpage[index]
          }, 
          success: function(res) {
            var data = res.data.datas;
            that.setData({
                goods_list : data.goods_list,
                gca_id: gca_id,
                index: index
            });
            // console.log(that.data.goods_list.concat(data.goods_list));
            if(!res.data.hasmore){
                    hasmore[index] = 0;
            }
          }
      });
  }, 
    
  /** 点击切换 */
  snacksTap:function(options){
       for(var i=1;i<=classifyNum;i++) {
           curpage[i] = 1;
           hasmore[i] = 1;
      }  
      var that = this;
      var gca_id = options.currentTarget.dataset.gca;
      var index = options.currentTarget.id;
      let id = options.currentTarget.id;
      this.setData({ 
          currentId: id,
          currentTab: options.target.dataset.current,
          gca_id: gca_id
       });       
        wx.request({
            method:'GET',
            url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoodsByCategory',
            data:{
                gca_id: gca_id,
                gca_parent_id: that.data.gca_parent_id,
                // curpage: curpage[index]
            },
            success: function(res){
                var data = res.data.datas;
                that.setData({
                    goods_list: data.goods_list,
                    index: index
                });
                if(!res.data.hasmore){
                    hasmore[index] = 0;
                }
            }
        });
    },

    /* 拉到底部加载更多数据 */
    scrolltolower: function(option) {
      var that = this;
      var gca_id = that.data.gca_id;
      var gca_parent_id = that.data.gca_parent_id;
      var cur = this.data.currentTab + 1;
      var index = parseInt(this.data.currentTab) + 1;
      if(hasmore[index]==1){
        curpage[index] += 1;   //拉到底部时改变了页数，需要在点击或滑动处重新赋值
        wx.request({
            url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoodsByCategory',
            data:{
                gca_id: gca_id,
                gca_parent_id: gca_parent_id,
                curpage: curpage[index]
            },
            success: function(res){
                var data = res.data.datas;               
                that.setData({
                    goods_list: that.data.goods_list.concat(data.goods_list)
                });
                hasmore[index] = res.data.hasmore;   
            }
         }); 
       }else{
           curpage[index]=0
       }
    }
});