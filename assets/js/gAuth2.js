/**{
    'apiKey': 'AIzaSyDi0DWfWqD-EyT4HYOVURLP-5HoD4iInIQ',
    'discoveryDocs': [discoveryUrl],
    'clientId': '752707560404-jchjt85k7q6ieq2vqvc810e3akjr2o8m.apps.googleusercontent.com',
    'scope': SCOPE
}*/
// Client ID and API key from the Developer Console
const CLIENT_ID = '752707560404-jchjt85k7q6ieq2vqvc810e3akjr2o8m.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl';

const authorizeButton = $('#authorize-button').hide();
const signoutButton = $('#signout-button').hide();

/**
 *  On load, called to load the auth2 library and API client library.
 */
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
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.hide();
    signoutButton.show();
    getPlaylists();
    getChannel();
  } else {
    authorizeButton.show();
    signoutButton.hide();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print files.
 */
function getPlaylists() {
	gapi.client.youtube.playlists.list({
		'part': 'snippet, contentDetails',
		'mine': 'true'
	}).then(res => {
		console.log(res)
	}).catch(err => console.log(err));
}

function getChannel() {
	gapi.client.youtube.channels.list({
		'part': 'snippet,contentDetails,statistics',
		'mine': 'true'
	}).then(res => {
		console.log(res)
	}).catch(err => console.log(err));
}