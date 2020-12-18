

const fetch = require('node-fetch');
let settings = { method: "Get" };


let urltest = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU&type=video&channelId=UCRzYFQvpcyLj0EhL5JQOGfQ&q=arc";
let urltest2 = "http://file.local/search.json";
let urltesttag = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU&type=video&id=Ff_4eh1UKls&part=snippet&fields=items(snippet(tags))";

var videos = new Array();

 fetch(urltest2, settings)
 .then(res => res.json())
 .then((json) => {
   json.items.forEach(element => {

     var video = {"titre": element.snippet["title"], "id": element.id.videoId,"Date": new Date(element.snippet["publishedAt"]) }
     
     videos.push(video);
   });
   videos.forEach(item =>{
    console.log(item["titre"]);
    console.log(item["id"]);
    //var datechien = new Date(item["Date"]);
    console.log(item["Date"].getUTCFullYear() +"  "+ item["Date"].getUTCMonth() +"  "+ item["Date"].getUTCDate());
    

   })
});

