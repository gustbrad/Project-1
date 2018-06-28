const config = {
    apiKey: "AIzaSyDi0DWfWqD-EyT4HYOVURLP-5HoD4iInIQ",
    authDomain: "playlist-30555.firebaseapp.com",
    databaseURL: "https://playlist-30555.firebaseio.com",
    projectId: "playlist-30555",
};
firebase.initializeApp(config);
const searchBtn = $('#search-button');
const searchInput = $('#search-input');
const searchResults = $('#yt-search-results');
const ytPlayer = $('#yt-player');
searchResults.hide();

//Restrict search-input from having special characters
$('#search-input').bind('keydown', function (event) {
  switch (event.keyCode) {
      case 8:  // Backspace
      case 9:  // Tab
      case 32: // Space
      case 37: // Left
      case 38: // Up
      case 39: // Right
      case 40: // Down
        break;
      default:


      var regex = new RegExp("^[a-zA-Z0-9.,/ $@]+$");
      var key = event.key;
      if (!regex.test(key)) {
         // event.preventDefault();
          return false;
      }
      else if (event.keyCode === 13) {
        $("#search-button").click();
      }
      break;
  }
});
//Prevent pasting  of special characters into search input
$('#search-input').on({
  keydown: function(e) {
      if (e.which === 220) {
          //e.preventDefault();
          var v = this.value,
              s = this.selectionStart;
          this.value = v.substr(0, s) + '' + v.substr(s, v.length);
      }
       if (e.which === 55) {
          e.preventDefault();
          var v = this.value,
              s = this.selectionStart;
          this.value = v.substr(0, s) + '7' + v.substr(s, v.length);
      }
  }, 
  paste: function(e) {
      var stopPaste = function(){

         this.value = this.value.replace(/[|&()]/g, '');
      };
                      

      setTimeout(stopPaste.bind(this), 1);
  }
});



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
      resultItemDiv = $('<div>').attr({'data-id': item.id.videoId, style: 'float: left;'}).addClass('youtube-search-result')
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
$(document).on('click','.youtube-search-result', function(e) {
  let VIDEO_ID = $(this).attr('data-id');
  ytPlayer.attr({src: `https://www.youtube.com/embed/${VIDEO_ID}`})
})
searchBtn.on('click', searchYt);