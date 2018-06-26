const config = {
    apiKey: "AIzaSyDi0DWfWqD-EyT4HYOVURLP-5HoD4iInIQ",
    authDomain: "playlist-30555.firebaseapp.com",
    databaseURL: "https://playlist-30555.firebaseio.com",
    projectId: "playlist-30555",
};
firebase.initializeApp(config);
const searchBtn = $('#search-button');
const searchInput = $('#search-input');
const searchResults = $('#yt-search-results')
searchResults.hide();

let usersChannel = { //Object for default user todo: need to populate this when we log the user in
  id: null,
  title: 'Guest',
  views: null,
  playlists: []
};

function displayResults(results) {
  searchResults.empty();
  for (let item of results) {
    let {channelId, channelTitle, description, publishedAt, thumbnails, title} = item.snippet;
    //item.id {kind, videoId}, item.kind, item.snippet {^}
    let resultItemDiv = $('<div>').attr({id: item.id.videoId}).addClass('youtube-search-result')
      .append($('<img>').attr({src: thumbnails.default.url, width: thumbnails.default.width, height: thumbnails.default.height,style: 'float: left;'}))
      .append($('<h6>').attr({}).text(title)).addClass('text-truncate') //would like to find out how to truncate this text
      .append($('<p>').text(description)) //should be truncated as well
      .append($('<span>').text(channelTitle))
      .append($('<span>').text(moment(publishedAt).format('lll')).attr({style: 'float: right;'}))//can be formatted better
      .append($('<div>').addClass('clearfix')) // to clear the floats in the div
    searchResults.append(resultItemDiv);
  
  }
}

searchBtn.on('click', searchYt)