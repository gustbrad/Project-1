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
  if(results.length > 0) {
    searchResults.empty();
    let resultItemDiv
    for (let item of results) {
      let {channelId, channelTitle, description, publishedAt, thumbnails, title} = item.snippet;
      //item.id {kind, videoId}, item.kind, item.snippet {^}
      resultItemDiv = $('<div>').attr({id: item.id.videoId,style: 'float: left;'}).addClass('youtube-search-result')
      let thumbnail = $('<img>').attr({src: thumbnails.default.url, width: thumbnails.default.width, height: thumbnails.default.height})
      let detailsDiv = $('<div>').attr({}).addClass('youtube-search-result-details')
        .append($('<h6>').addClass('text-truncate result-title').attr({}).text(title)) //would like to find out how to truncate this text
        .append($('<p>').addClass('text-truncate result-description').text(description)) //should be truncated as well
        .append($('<span>').addClass('result-creator').text(channelTitle))
        .append($('<span>').addClass('result-date-created').text(moment(publishedAt).format('lll')).attr({}))//can be formatted better
        .append($('<div>').addClass('clearfix')) // to clear the floats in the div
      resultItemDiv.append(thumbnail).append(detailsDiv)
      searchResults.append(resultItemDiv);  
    }
    searchResults.show();
  }
};

searchBtn.on('click', searchYt)