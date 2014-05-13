var Channel = Backbone.Model.extend({
    initialize: function(){
    },
    defaults: {
    	id: '100',
        name:'',
        url: '#'
    }
});

var feed = Backbone.Model.extend({
	initialize: function(){
    },
    defaults: {
    	id: '1000',
        author:'test',
        content: 'test',
        contentSnippet:'test',
        link:'test',
        publishedDate:'test',
        title:'无题'
    }
});
var feedCollection = Backbone.Collection.extend({
	model: feed
});
var starCollection =Backbone.Collection.extend({
            model: feed,
            localStorage: new Backbone.LocalStorage("star")
});
var followChannelCollection= Backbone.Collection.extend({
            model : Channel,
            localStorage: new Backbone.LocalStorage("follow")
});

var followchannelcollection = new followChannelCollection;
var feedcollection  = new feedCollection;
var starcollection  = new  starCollection;
var app;


function get_feed(url ,router) {
	var MaxCount = 10;
	$.ajax({
		url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + MaxCount + "&output=json&q=" + encodeURIComponent(url) + "&hl=en&callback=?",
		dataType: "json",
		success: function(data) {
                                        var temcollection = new feedCollection;
                                        var feed_id = feedcollection.length;
                                      //  console.log(feed_id);
			$.each(data.responseData.feed.entries, function(e, item) {
				var temfeed= new feed({
					id: feed_id++,
					author: item.author,
					content: item.content,
					contentSnippet: item.contentSnippet,
					link: item.link,
					publishedDate: item.publishedDate,
					title: item.title
				});
                                                    feedcollection.add(temfeed);
                                                    
                                                     temcollection.add(temfeed);
				//console.log(JSON.stringify(feedcollection));
			});
			router.changePage(new FeedListView({collection:temcollection}));

		}
	});
}

var HomeView = Backbone.View.extend({

    template:_.template($('#home').html()),


    render:function (eventName) {
        $(this.el).html(this.template({channel:this.collection.toJSON()}));
        return this;
    }
});
var FeedListView = Backbone.View.extend({
	template:_.template($('#feed').html()),

	render:function (eventName) {
       $(this.el).html(this.template({feed:this.collection.toJSON()}));
        return this;
    }
});
 var FeedView = Backbone.View.extend({
        template:_.template($('#content').html()),
        initialize: function(){
                
        },
        
        render:function (eventName) {
                    //console.log(this.model.toJSON());
                    $(this.el).html(this.template({feed: this.model.toJSON()}));
                    return this;
         }
     
});
 var  StarItemView = Backbone.View.extend({
        template:_.template($('#starcontent').html()),
        initialize: function(){
                
        },
        
        render:function (eventName) {
                    //console.log(this.model.toJSON());
                    $(this.el).html(this.template({star: this.model.toJSON()}));
                    return this;
         }
     
});

 var  PlusView= Backbone.View.extend({
        template:_.template($('#plus').html()),
        initialize: function(){
                
        },
        
        render:function (eventName) {
                    //console.log(this.model.toJSON());
                    $(this.el).html(this.template());
                    return this;
         }
     
});

var StarView = Backbone.View.extend({

    template:_.template($('#star').html()),
    initialize: function(){
       
    },
    

    render:function (eventName) {
        $(this.el).html(this.template({star:this.collection.toJSON()}));
       
        return this;
    }

});



var AppRouter = Backbone.Router.extend({
	routes:{
        "":"home",
        "channel/:name/*url":"feed",
        "content/:id" :"content",
        "star":"star",
        "chanel_delete/:id":"chanel_delete",
        "delete_conf/:id":"delete_conf",
        "starcontent/:id":"starcontent",
        "add_conf/:id":"add_conf",
        "plus":"plus",
        "plus_rss":"plus_rss"
        
    },
    initialize:function () {
        // Handle back button throughout the application
        $('.back').on('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },
 


    home:function () {
     //   console.log('#home');
        this.changePage(new HomeView({collection:followchannelcollection}));
    },

    feed:function(name , url) {
    //console.log('#feed'+name+url);
    	get_feed(url,this);
   		//this.changePage(new FeedView({collection:feedcollection}));
    },

    content:function(id ){
             var contentView; 
    	//console.log('#content'+id);
                 contentView=feedcollection.get(id);
                  this.changePage(new FeedView({model:contentView}));
    },
    starcontent:function(id ){
                    var contentView; 
                    contentView=starcollection.get(id)
                 this.changePage(new  StarItemView({model:contentView}));
    },

    star:function(){
            // console.log('#star');
             this.starPage = true;
             var starView = new StarView({collection:starcollection});
             this.changePage(starView);
    },
  
    delete_conf:function(id){
            var r=confirm("确认删除?");
            if(r==true){
            starcollection.remove(starcollection.get(id));
            console.log(JSON.stringify(starcollection));
            this.navigate("star", { trigger: true });}
    },
    
    add_conf:function(id){
            var r=confirm("确认添加?");
            if(r==true){
            var star_id = starcollection.length;
            var add =  feedcollection.get(id);
           // console.log(JSON.stringify(add));
            var  temp = new feed ({
                    id: star_id++,
                    author:add.get("author"),
                    content: add.get("content"),
                    contentSnippet:  add.get("contentSnippet"),
                    link:add.get("link"),
                    publishedDate:add.get("publishedDate"),
                    title:add.get(" title")
            });
            console.log(JSON.stringify(temp));
            starcollection.create(temp);}
           //  console.log(JSON.stringify(starcollection));
        },
        chanel_delete:function(id){
            var r=confirm("确认删除?");
            if(r==true){
                followchannelcollection.remove(followchannelcollection.get(id));
                this.navigate("", { trigger: true });}
            
        },
        plus:function(){
                 this.changePage(new PlusView());
        },

        plus_rss:function(){
                var rss_id=followchannelcollection.length+15;
                var name =$("#name").val();
                var url =$("#channel_url").val();
                console.log(name+url);
                if (_.isEmpty(name)||_.isEmpty(url)){
                    confirm("地址和名称不能为空！");
                }else{
                    followchannelcollection.create(new  Channel({id:rss_id,name:name,url:url}));
                    console.log(JSON.stringify(followchannelcollection));
                    confirm("保存成功");
                    $("#name").empty();
                    $("#channel_url").empty();
                }
        },

        changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
        }

});



function app_initial(){
	followchannelcollection.create(new Channel({id: "1",name: "国内焦点",url:"http://www.feedsoso.com/feed/ga10cv"}));
	followchannelcollection.create(new Channel({id: "2",name: "国际焦点",url:"http://news.baidu.com/n?cmd=1&class=internews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "3",name: "军事焦点",url:"http://news.baidu.com/n?cmd=1&class=mil&tn=rss"}));
	followchannelcollection.create(new Channel({id: "4",name: "财经焦点",url:"http://news.baidu.com/n?cmd=1&class=finannews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "5",name: "互联网焦点",url:"http://news.baidu.com/n?cmd=1&class=internet&tn=rss"}));
	followchannelcollection.create(new Channel({id: "6",name: "房产焦点",url:"http://news.baidu.com/n?cmd=1&class=housenews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "7",name: "汽车焦点",url:"http://news.baidu.com/n?cmd=1&class=autonews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "8",name: "体育焦点",url:"http://news.baidu.com/n?cmd=1&class=sportnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "9",name: "娱乐焦点",url:"http://news.baidu.com/n?cmd=1&class=enternews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "10",name: "游戏焦点",url:"http://news.baidu.com/n?cmd=1&class=gamenews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "11",name: "教育焦点",url:"http://news.baidu.com/n?cmd=1&class=edunnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "12",name: "女人焦点",url:"http://news.baidu.com/n?cmd=1&class=healthnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "13",name: "科技焦点",url:"http://news.baidu.com/n?cmd=1&class=technnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "14",name: "社会焦点",url:"http://news.baidu.com/n?cmd=1&class=socianews&tn=rss"}));	

            //test
            starcollection.create(new feed());
}



