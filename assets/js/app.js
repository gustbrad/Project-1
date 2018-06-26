const config = {
    apiKey: "AIzaSyDi0DWfWqD-EyT4HYOVURLP-5HoD4iInIQ",
    authDomain: "playlist-30555.firebaseapp.com",
    databaseURL: "https://playlist-30555.firebaseio.com",
    projectId: "playlist-30555",
};
firebase.initializeApp(config);
const searchBtn = $('#search-button');
const searchInput = $('#search-input');

let usersChannel = { //Object for default user todo: need to populate this when we log the user in
  id: null,
  title: 'Guest',
  views: null,
  playlists: []
};

function displayResults(results) {
  for (let item of results) {
    console.log(item)
  }
}

searchBtn.on('click', searchYt)



