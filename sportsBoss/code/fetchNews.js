var http = require('http')
var console = require('console')

/*
  Builds an object with the tags shared between all types of RSS Feeds
  */
function buildSharedtags(channel, i, search) {
	var ret = {}

	ret.tag = search.text
	if (channel.item[i].link)
		ret.link = channel.item[i].link
	if (channel.copyright)
		ret.copyright = channel.copyright
	if ("enclosure" in channel.item[i]) {
		if (channel.item[i]['itunes:image'])
			ret.image = { url: channel.item[i]['itunes:image']['@href'] }
		else
			ret.image = { url: "icon.png" }
	} else if (channel.image)
		ret.copyrightImage = { url: channel.image.url }
	if (channel.description)
		ret.feedDescription = channel.description
	if (channel.item[i].title)
		ret.title = channel.item[i].title
	else
		ret.title = "No title"
	if (channel.item[i].pubDate)
		ret.date = channel.item[i].pubDate
	else
		ret.date = "Unknown"
	if (channel.item[i].image)
		ret.image = { url: channel.item[i].image }
	else
		ret.image = { url: "icon.png" }
	if (typeof channel.item[i].description == 'string'
		&& channel.item[i].description
		&& channel.item[i].description != 'null')
		ret.description = channel.item[i].description
	else
		ret.description = "No description"
	return ret;
}

/*
  Builds audioItem with given item from RSS feed
  */
function buildAudioItem(data, i) {
	return ({
		id: 1,
		stream: [
			{
				url: data.rss.channel.item[i]['enclosure']['@url'],
				format: "mp3"
			}
		],
		title: data.rss.channel.item[i].title,
		subtitle: data.rss.channel.item[i]['itunes:subtitle'],
		artist: data.rss.channel.item[i]['itunes:author'],
		albumArtUrl: data.rss.channel.item[i]['itunes:image']['@href']
	})
}

module.exports.function = function fetchNews(tag, search) {
	var data = http.getUrl(search.url, { format: 'xmljs' })
	var ret = []

	for (var i = 0; i < data.rss.channel.item.length; i += 1) {
		ret.push(buildSharedtags(data.rss.channel, i, search))
		if ("enclosure" in data.rss.channel.item[i]) {
			console.log(buildAudioItem(data, i))
			ret[ret.length - 1].audioItem = buildAudioItem(data, i)
		}
	}
	return ret
}