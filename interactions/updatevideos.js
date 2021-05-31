module.exports={updatevideos};
const { client } = require('../bot.js');
const { default: fetch } = require('node-fetch');
const he = require('he');
const {con} = require('../GlobalVars.js');

async function updatevideos(interaction){
    var message;
    var videos = [];
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 5,
        data:{
            content : "test"
        }
        
      }});
      let adminRole = client.guilds.cache.get(interaction["guild_id"]).roles.cache.find(role => role.name === "YouTubers B&S");
    if(!interaction.member.roles.includes(adminRole.id)){
        message = "🚫 Vous n'avez pas la permission d'effectuer cette commande";
        endMessage();
        return;
    }


    async function fetchAsync(urlstring) {
        let response = await fetch(urlstring);
        let data = await response.json();
        return data;
    }
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet"
    + "&key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU"
    + "&type=video"
    + "&channelId=UCRzYFQvpcyLj0EhL5JQOGfQ"
    + "&fields=nextPageToken,items(snippet(publishedAt,title),id(videoId))"
    + "&maxResults=50";
    
    var nextpagetoken;
    do{
    try {
        var fullUrl;
        if( nextpagetoken !== undefined){fullUrl = url + '&pageToken=' + nextpagetoken;}
        else{fullUrl = url}
        console.log(fullUrl);
        var data = await fetchAsync(fullUrl); // throw une exception si erreur de connexion.
        if ("error" in data) { throw 'Erreur de Quota ou Autre' }
        nextpagetoken = data["nextPageToken"];
        
        await Promise.all(data.items.map(async (element)=>{
            
            var Tags = await fetchAsync("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU&type=video&id=" + element.id.videoId + "&part=snippet&fields=items(snippet(tags))");
            if (Tags.items[0].snippet.tags === undefined || !Tags.items[0].snippet.tags.includes("no-bot")) {
              var video = { "titre": he.decode(element.snippet["title"]), "id": element.id.videoId, "Date": element.snippet["publishedAt"] };
              videos.push(video);
            }

        }));

      } catch (err) {
        console.log(err);
        message = "🛑 erreur d'api";
      }
    }while( nextpagetoken !== undefined);

    var insertstring = "";
    for(var video of videos){
    if( insertstring != ""){insertstring += ',';}
    insertstring += '(\''+video.id+'\',\"'+ video.titre+'\",\''+video.Date+'\')';

    }

    var sqlquery= 'Delete from Videos where VideoID != \'!#event\'; Insert into Videos values' + insertstring + ';Update Settings Set LastUpdate=\''+ new Date().toISOString()+'\';';
    const query = new Promise(resolve =>{ con.query(sqlquery,  (err, result) =>{
        if(err){  message = '🛑 erreur de connexion à la base de données. Reessayez plus tard.'; console.log(err);}
        if(result){ message = '✅ La base de données a été mise a jour ('+result[1].affectedRows+' lignes Ajoutées)';}
        resolve();
    });
    });
    await query;

    endMessage();
   function endMessage(){
    client.api.webhooks('785217364769636362', interaction.token).messages['@original'].patch(
        {data: {
            content: message
          }}
    );}
        }