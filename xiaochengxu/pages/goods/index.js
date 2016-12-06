/* index.js */
var app = getApp();
var curpage = [];         //  分页页数递增
var gca_id = 1;
var hasmore = [];         //  判断是否有分页
var num = 1;
var requestState = []     //  分类请求状态
Page({
  data: {
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,
    currentGcaId: 0,
    more: '',
    goods_list: [],
    indicatorDots: false,    // 是否显示面板指示点
    autoplay: false,    // 是否自动切换
    interval: 5000,     // 自动切换时间间隔
    duration: 1000     // 滑动动画时长 
  },

  onLoad: function (options) {   
    var that = this;
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
      url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketRecommend',
      success : function(res){
        var data = res.data.datas;
        num = data.category.length;
        //页面加载时给分页数据赋值，给是否有更多页赋值
        for(var i=1 ; i<=num ; i++){
            curpage[i] = 1;
            hasmore[i] = 1;
            requestState[i] = 1;
        }
        that.setData({
             mb_adv_list : data.adv.mb_adv_list,
             category : data.category,
             hot : data.hot,
             sale : data.sale,
             eat : data.eat
         });
       }
    });
  },
  
  /* 滑动切换 */
   bindChange: function(e) {
   //重新给分页数据赋值，给是否有更多页赋值
    for(var i=1 ; i<=num ; i++){
        curpage[i] = 1;
        hasmore[i] = 1;
    }
    gca_id=e.detail.current;   //关联数据
    var that = this; 
    that.setData({ 
      currentId:e.detail.current,
      currentTab: e.detail.current,
      currentGcaId: gca_id,
      navHover: ''
    });  
    /* 判断请求状态 且 为分类数据 */
    if(gca_id==0){
      wx.request({
          method:'GET',
          url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketRecommend',
          data:{gca_id:gca_id},
          success: function(res) {
            var data = res.data.datas;
            that.setData({
                mb_adv_list : data.adv.mb_adv_list,
                child : data.category.child,
                goods_list : data.goods_list,
                gca_id: gca_id
            });
            if(!res.data.hasmore){
                hasmore[gca_id] = 0;
                /**that.setData({
                  more: "没有更多数据"
                });**/
            }   
            //requestState[gca_id] = 0; // 已经请求(标记)
          }
      }); 
    }else{
       wx.request({
          method:'GET',
          url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoods',
          data:{gca_id:gca_id,curpage:curpage[gca_id]},
          success: function(res) {
            var data = res.data.datas;
            that.setData({
                mb_adv_list : data.adv.mb_adv_list,
                child : data.category.child,
                goods_list : data.goods_list,
                gca_id: gca_id
            });
            if(!res.data.hasmore){
                hasmore[gca_id] = 0;
                /**that.setData({
                  more: "没有更多数据"
                });**/
            }   
            //requestState[gca_id] = 0; // 已经请求(标记)
          }
      }); 
    }
  }, 
 
 /* 点击切换 */
  handleTap: function(option){ 
    for(var i=1 ; i<=num ; i++){
        curpage[i] = 1;
        hasmore[i] = 1;
    }  
    var that = this;
    var gca_id = option.currentTarget.dataset.gca;
    let id = option.currentTarget.id;
    that.setData({
      currentGcaId: gca_id,
      currentId : id , 
      currentTab : id,
      navHover: ''
    });
    /* 判断请求状态 且 为分类数据 */
    if(gca_id==0){
        wx.request({
          method: 'GET',
          url: 'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketRecommend',
          data: {
            gca_id:gca_id
          },
          success: function(res)  {
            var data = res.data.datas;
            that.setData({
                mb_adv_list : data.adv.mb_adv_list,
                child : data.category.child,
                goods_list : data.goods_list
            })
            if(!res.data.hasmore){
                hasmore[gca_id] = 0;
                /**that.setData({
                  more: "没有更多数据"
                });**/
            }
            //requestState[gca_id] = 0; // 已经请求(标记)
          }
       })
    }
    else{
       wx.request({
          method: 'GET',
          url: 'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoods',
          data: {
            gca_id:gca_id,
            curpage:curpage[gca_id]
          },
          success: function(res)  {
            var data = res.data.datas;
            that.setData({
                mb_adv_list : data.adv.mb_adv_list,
                child : data.category.child,
                goods_list : data.goods_list
            })
            if(!res.data.hasmore){
                hasmore[gca_id] = 0;
                /**that.setData({
                  more: "没有更多数据"
                });**/
            }
            //requestState[gca_id] = 0; // 已经请求(标记)
          }
       })
    }
  },

  /* 拉到底部加载更多数据 */
  scrolltolower: function(option) {
      var that = this;
      gca_id = this.data.currentGcaId;
      if (gca_id > 0) {        
        curpage[gca_id] += 1;       
        if(hasmore[gca_id]) {
            wx.request({
              url:'https://www.zouzoubar.com/mobile/index.php?act=goods&op=listMarketGoods',
              data:{
                gca_id:gca_id,
                curpage:curpage[gca_id]
              },
              success: function(res){
                var data = res.data.datas;               
                that.setData({
                  goods_list: that.data.goods_list.concat(data.goods_list)
                });
                if(!res.data.hasmore){
                  hasmore[gca_id] = 0;
                  /**that.setData({
                      more: "没有更多数据"
                  }); **/
                }              
              }
            }); 
          } else {
          hasmore[gca_id] = 0;
          /**that.setData({
            more: "没有更多数据"
          });**/
        }
      }
    }
});