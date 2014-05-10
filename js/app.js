
var Channel = Backbone.Model.extend({
    initialize: function(){
    },
    defaults: {
    	id: '',
        name:'',
        url: '#'
    }
});

var unfollowChannelCollection= Backbone.Collection.extend({
    model : Channel
});

var followChannelCollection= Backbone.Collection.extend({
    model : Channel
});

var followchannelcollection = new followChannelCollection;
var unfollowchannelcollection = new unfollowChannelCollection;

function app_initial(){


	followchannelcollection.add(new Channel({id: "1",name: "国内焦点",url:"http://news.baidu.com/n?cmd=1&class=civilnews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "2",name: "国际焦点",url:"http://news.baidu.com/n?cmd=1&class=internews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "3",name: "军事焦点",url:"http://news.baidu.com/n?cmd=1&class=mil&tn=rss"}));
	followchannelcollection.add(new Channel({id: "4",name: "财经焦点",url:"http://news.baidu.com/n?cmd=1&class=finannews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "5",name: "互联网焦点",url:"http://news.baidu.com/n?cmd=1&class=internet&tn=rss"}));
	followchannelcollection.add(new Channel({id: "6",name: "房产焦点",url:"http://news.baidu.com/n?cmd=1&class=housenews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "7",name: "汽车焦点",url:"http://news.baidu.com/n?cmd=1&class=autonews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "8",name: "体育焦点",url:"http://news.baidu.com/n?cmd=1&class=sportnews&tn=rss"}));
	followchannelcollection.add(new Channel({id: "9",name: "娱乐焦点",url:"http://news.baidu.com/n?cmd=1&class=enternews&tn=rss"}));

	unfollowchannelcollection.add(new Channel({id: "10",name: "游戏焦点",url:"http://news.baidu.com/n?cmd=1&class=gamenews&tn=rss"}));
	unfollowchannelcollection.add(new Channel({id: "11",name: "教育焦点",url:"http://news.baidu.com/n?cmd=1&class=edunnews&tn=rss"}));
	unfollowchannelcollection.add(new Channel({id: "12",name: "女人焦点",url:"http://news.baidu.com/n?cmd=1&class=healthnews&tn=rss"}));
	unfollowchannelcollection.add(new Channel({id: "13",name: "科技焦点",url:"http://news.baidu.com/n?cmd=1&class=technnews&tn=rss"}));
	unfollowchannelcollection.add(new Channel({id: "14",name: "社会焦点",url:"http://news.baidu.com/n?cmd=1&class=socianews&tn=rss"}));	


}


