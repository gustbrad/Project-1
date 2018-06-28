const API_KEY = `AIzaSyAowmVgFQkCDODU9HZ9SFVmeQlniBW_zfU`;

function searchYoutube() {
    $.ajax({'url': `https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list?part=snippet&order=viewCount&q=skateboarding+dog&type=video&videoDefinition=high&key=${API_KEY}`, 'method': 'GET'})
        .then(res => console.log(res))
        .catch(err => console.log(err))
};
searchYoutube();