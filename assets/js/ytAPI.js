function searchYoutube() {
    fetch(`https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list?part=snippet&order=viewCount&q=skateboarding+dog&type=video&videoDefinition=high`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
};
searchYoutube();