

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
    	id: '',
        author:'',
        content: '',
        contentSnippet:'',
        link:'',
        publishedDate:'',
        title:''
    }
});
var feedCollection =Backbone.Collection.extend({
	model : feed
});


var unfollowChannelCollection= Backbone.Collection.extend({
    model : Channel,
    localStorage: new Backbone.LocalStorage("unfollow")
});

var followChannelCollection= Backbone.Collection.extend({
    model : Channel,
    localStorage: new Backbone.LocalStorage("follow")
});

var followchannelcollection = new followChannelCollection;
var unfollowchannelcollection = new unfollowChannelCollection;
var feedcollection;

function get_feed(url){
	var MaxCount=10;
	feedcollection = new feedCollection;
	$.ajax({
			url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + MaxCount + "&output=json&q=" + encodeURIComponent(url) + "&hl=en&callback=?",
			dataType: "json",
			success: function(data) {
				$.each(data.responseData.feed.entries, function(e, item) {
					console.log(item.author);
					feedcollection.add(new feed({id:e,
												author:item.author,
												content:item.content,
												contentSnippet:item.contentSnippet,
												link:item.link,
												publishedDate:item.publishedDate,
												title:item.title
					}));
					console.log(JSON.stringify(feedcollection));

				});
			}});
}

var HomeView = Backbone.View.extend({

    template:_.template($('#home').html()),

    render:function (eventName) {
        $(this.el).html(this.template({channel:this.collection.toJSON()}));
        return this;
    }
});
var FeedView = Backbone.View.extend({
	template:_.template($('#feed').html()),

	render:function (eventName) {
       $(this.el).html(this.template({feed:this.collection.toJSON()}));
        return this;
    }
});



var AppRouter = Backbone.Router.extend({
	routes:{
        "":"home",
        "channel/:name/:url":"feed"
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
        console.log('#home');
        this.changePage(new HomeView({collection:followchannelcollection}));
    },

    feed:function(name , url) {
    	console.log('#feed'+name+url);
    	get_feed(url);
   		this.changePage(new FeedView({collection:feedcollection}))
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

	followchannelcollection.create(new Channel({id: "1",name: "国内焦点",url:"http://news.baidu.com/n?cmd=1&class=civilnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "2",name: "国际焦点",url:"http://news.baidu.com/n?cmd=1&class=internews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "3",name: "军事焦点",url:"http://news.baidu.com/n?cmd=1&class=mil&tn=rss"}));
	followchannelcollection.create(new Channel({id: "4",name: "财经焦点",url:"http://news.baidu.com/n?cmd=1&class=finannews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "5",name: "互联网焦点",url:"http://news.baidu.com/n?cmd=1&class=internet&tn=rss"}));
	followchannelcollection.create(new Channel({id: "6",name: "房产焦点",url:"http://news.baidu.com/n?cmd=1&class=housenews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "7",name: "汽车焦点",url:"http://news.baidu.com/n?cmd=1&class=autonews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "8",name: "体育焦点",url:"http://news.baidu.com/n?cmd=1&class=sportnews&tn=rss"}));
	followchannelcollection.create(new Channel({id: "9",name: "娱乐焦点",url:"http://news.baidu.com/n?cmd=1&class=enternews&tn=rss"}));

	unfollowchannelcollection.create(new Channel({id: "10",name: "游戏焦点",url:"http://news.baidu.com/n?cmd=1&class=gamenews&tn=rss"}));
	unfollowchannelcollection.create(new Channel({id: "11",name: "教育焦点",url:"http://news.baidu.com/n?cmd=1&class=edunnews&tn=rss"}));
	unfollowchannelcollection.create(new Channel({id: "12",name: "女人焦点",url:"http://news.baidu.com/n?cmd=1&class=healthnews&tn=rss"}));
	unfollowchannelcollection.create(new Channel({id: "13",name: "科技焦点",url:"http://news.baidu.com/n?cmd=1&class=technnews&tn=rss"}));
	unfollowchannelcollection.create(new Channel({id: "14",name: "社会焦点",url:"http://news.baidu.com/n?cmd=1&class=socianews&tn=rss"}));	

}



