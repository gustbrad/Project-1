const config = {
	apiKey: 'AIzaSyDi0DWfWqD-EyT4HYOVURLP-5HoD4iInIQ',
	authDomain: 'playlist-30555.firebaseapp.com',
	databaseURL: 'https://playlist-30555.firebaseio.com',
	projectId: 'playlist-30555',
};
firebase.initializeApp(config);

const playlistsRef = firebase.database().ref('playlists');
const searchResultsLyrics = $('#search-results-lyrics');
const searchBtn = $('#search-button');
const searchInput = $('#search-input');
const searchResults = $('#yt-search-results');
const ytPlayer = $('#yt-player');
searchResults.hide();

playlistsRef.child('1').child('playlist1').on('value', snap => { // For Playlist Page
	let playlist = snap.val();
	let playlistDiv = $('#saved-music').empty();

	for (const song in playlist) {
		const { videoId, lyricId, songName } = playlist[song]
		playlistDiv.append($('<a>').attr({ id: song, href: '../../index.html' }).text(songName))
		// console.log(songName)
	}
});

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

			var regex = new RegExp('^[a-zA-Z0-9.,/ $@]+$');
			var key = event.key;
			if (!regex.test(key)) {
				// event.preventDefault();
				return false;
			}
			else if (event.keyCode === 13) {
				$('#search-button').click();
			}
			break;
	}
});
//Prevent pasting  of special characters into search input
$('#search-input').on({
	keydown: function (e) {
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
	paste: function (e) {
		var stopPaste = function () {

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
	let { items, kind, nextPageToken, prevPageToken, pageInfo } = results;
	if (items.length > 0) {
		searchResults.empty();
		let resultItemDiv
		for (let item of items) {
			let { channelId, channelTitle, description, publishedAt, thumbnails, title } = item.snippet;
			//item.id {kind, videoId}, item.kind, item.snippet {^}
			resultItemDiv = $('<div>').attr({ 'data-id': item.id.videoId, style: 'float: left;' }).addClass('youtube-search-result')
			let thumbnail = $('<img>').attr({ src: thumbnails.default.url, width: thumbnails.default.width, height: thumbnails.default.height })
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
$(document).on('click', '.youtube-search-result', function (e) {
	let VIDEO_ID = $(this).attr('data-id');
	ytPlayer.attr({ src: `https://www.youtube.com/embed/${VIDEO_ID}` })
})

searchBtn.on('click', function (e) {
	e.preventDefault();
	let q = searchInput.val().trim().replace(' ', '+') || 'cats';
	//searchYoutube(q)
});

searchBtn.on('click', function (e) {
	e.preventDefault();
	var trackSearch = searchInput.val().trim()
	console.log(trackSearch)

	// Perfoming an AJAX GET request to our queryURL
	$.ajax({
		type: 'GET',
		data: {
			apikey: '837d23235a55ecdf0d0c33f76c0c1051',
			q_track: trackSearch,
			f_has_lyrics: 'yes',
			format: 'jsonp',
			callback: 'jsonp_callback'
		},
		url: 'https://api.musixmatch.com/ws/1.1/track.search',
		dataType: 'jsonp',
		jsonpCallback: 'jsonp_callback',
		contentType: 'application/json',
	}).then(function (data) {
		console.log(data)
		for (var i = 0; i < data.message.body.track_list.length; i++) {
			console.log(data.message.body.track_list[i].track.artist_name)

			var letterP = $('<p>')
				.addClass('lyrics-search-result')
				.attr({
					'data-artist': data.message.body.track_list[i].track.artist_name,
					'data-track-id': data.message.body.track_list[i].track.track_id,
					'data-track-name': data.message.body.track_list[i].track.commontrack_vanity_id,
				}).text(data.message.body.track_list[i].track.artist_name);
			searchResults.append(letterP);
		}

		searchResults.show();
	});
	
});
$(document).on('click', '.lyrics-search-result', function (e) {

	console.log($(this).attr('data-artist'));
	console.log($(this).attr('data-track-id'));
	let songName = $(this).attr('data-track-name');
	trackId = $(this).attr('data-track-id');
	let pT = ''; 

	$.ajax({
		type: 'GET',
		data: {
			apikey: '837d23235a55ecdf0d0c33f76c0c1051',
			track_id: trackId,
			format: 'jsonp',
			callback: 'jsonp_callback'
		},
		url: 'https://api.musixmatch.com/ws/1.1/track.lyrics.get',
		dataType: 'jsonp',
		jsonpCallback: 'jsonp_callback',
		contentType: 'application/json',

	}).then(function (data) {
		console.log(data)
		var letterP = $('<p>');
		letterP.text(data.message.body.lyrics.lyrics_body);
		searchResultsLyrics.append(letterP);
		searchYoutube(songName, pT);
	});
	searchResults.hide();

});