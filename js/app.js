

var Channel = Backbone.Model.extend({
    initialize: function(){
    },
    defaults: {
    	id: '',
        name:'',
        url: '#'
    }
});

var feed = Backbone.Model.extend({
	initialize: function(){
    },
    defaults: {
    	id: '1001',
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
var feed_id;


function get_feed(url ,router) {
	var MaxCount = 10;
	$.ajax({
		url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + MaxCount + "&output=json&q=" + encodeURIComponent(url) + "&hl=en&callback=?",
		dataType: "json",
		success: function(data) {
			$.each(data.responseData.feed.entries, function(e, item) {
				feedcollection.add(new feed({
					id: e,
					author: item.author,
					content: item.content,
					contentSnippet: item.contentSnippet,
					link: item.link,
					publishedDate: item.publishedDate,
					title: item.title
				}));
				//console.log(JSON.stringify(feedcollection));
			});
			router.changePage(new FeedListView({collection:feedcollection}));
		}
	});
}

window.HomeView = Backbone.View.extend({

    template:_.template($('#home').html()),

    render:function (eventName) {
        $(this.el).html(this.template({channel:this.collection.toJSON()}));
        return this;
    }
});
window.FeedListView = Backbone.View.extend({
	template:_.template($('#feed').html()),

	render:function (eventName) {
       $(this.el).html(this.template({feed:this.collection.toJSON()}));
        return this;
    }
});
window.FeedView = Backbone.View.extend({
	template:_.template($('#content').html()),

	render:function (eventName) {
		console.log(this.model.toJSON());
       $(this.el).html(this.template({feed: this.model.toJSON()}));
        return this;
    }
});

window.StarView = Backbone.View.extend({

    template:_.template($('#star').html()),
     initialize:function () {
            this.listenTo(this.collection, 'remove', this.render);
     },
    events: {
            "click  [href='#stardelete']": "deletepop",
            "click  [href='#delete_conf']":"delete_conf"
     },

    render:function (eventName) {
        $(this.el).html(this.template({star:this.collection.toJSON()}));
        return this;
    },
    deletepop :function(eventName){
        $("#stardelete").popup( "open",{transition:"pop"});
        var delete_id = $(eventName.target).attr('id');
        console.log(delete_id);
        $("#delete_conf").attr("href","#delete_conf/"+delete_id);
        console.log($("#delete_conf").attr("href"));
    }
    

});



var AppRouter = Backbone.Router.extend({
	routes:{
        "":"home",
        "channel/:name/*url":"feed",
        "content/:id/:from" :"content",
        "star":"star",
        "delete_conf/:id":"delete_conf"
        
    },
    initialize:function () {
        // Handle back button throughout the application
        $('.back').on('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
        this.starPage = false;
    },
    delete_conf:function(id){
        console.log(id);
        $("#stardelete").popup( "close" );
        starcollection.remove(starcollection.get(id));
         console.log(JSON.stringify(starcollection));
    },


    home:function () {
        console.log('#home');
        this.changePage(new HomeView({collection:followchannelcollection}));
    },

    feed:function(name , url) {
    	console.log('#feed'+name+url);
    	get_feed(url,this);
   		//this.changePage(new FeedView({collection:feedcollection}));
    },

    content:function(id,from ){
             var contentView; 
    	console.log('#content'+id);
    	feed_id =id;
              if(from =="feed"){
                 contentView=feedcollection.get(feed_id);
              }else
              {
                contentView=starcollection.get(feed_id);
              }
             this.changePage(new FeedView({model:contentView}));
    },
    star:function(){
             console.log('#star');
             this.starPage = true;
             var starView = new StarView({collection:starcollection});
             this.changePage(starView);
    },
  
    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        var reverse = false;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        if(this.starPage){
            reverse =true;
            this.starPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition,reverse :reverse});
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



