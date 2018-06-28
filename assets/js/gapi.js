const CLIENT_ID = '752707560404-jchjt85k7q6ieq2vqvc810e3akjr2o8m.apps.googleusercontent.com';

let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

const SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl';

const authorizeButton = $('#authorize-button');
const signoutButton = $('#signout-button').hide();
// todo: We need to reauth a user every hour when their O-Auth2 token expires

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.on('click', handleAuthClick);
		signoutButton.on('click', handleSignoutClick);
	}).catch(err => console.error(err));
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.hide();
		signoutButton.show();
		// getPlaylists();
		getChannel();
	} else {
		authorizeButton.show();
		signoutButton.hide();
	}
}

function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}


function getPlaylistItems() {
	console.log(usersChannel.playlists[0].id)
	gapi.client.youtube.playlistItems.list({
		'part': 'snippet',
		'playlistId': usersChannel.playlists[0].id,
		'maxResults': 10
	}).then(res => {
		console.log(res)
	}).catch(err => console.error(err.details));
}

function getPlaylists() {
	gapi.client.youtube.playlists.list({
		'part': 'snippet, contentDetails',
		'mine': 'true'
	}).then(res => {
		usersChannel.playlists = [];
		for (let playlist of res.result.items) {
			if (playlist.kind === 'youtube#playlist') {
				console.log(playlist);
				usersChannel.playlists.push(playlist.id);
			}
		}
		console.log(usersChannel);
		// getPlaylistItems();
		let { id, kind, snippet, statistics, contentDetails } = res.result.items[0];

	}).catch(err => console.log(err));
}
function searchYt(e) {
  if(e) {
    e.preventDefault();
  }
	let q = searchInput.val().trim() || 'cats';
	gapi.client.youtube.search.list({
		'part': 'snippet',
		'q': q
	}).then(res => {
    displayResults(res.result.items);
    searchInput.val('')
	}).catch(err => console.log(err));
}

function getChannel() {
	gapi.client.youtube.channels.list({
		'part': 'snippet,contentDetails,statistics',
		'mine': 'true'
	}).then(res => {
		let { id, kind, snippet, statistics, contentDetails } = res.result.items[0];
		usersChannel.title = snippet.title;
		usersChannel.id = id;
		usersChannel.views = statistics.viewCount;
		console.log(usersChannel)
	}).catch(err => console.log(err));
}