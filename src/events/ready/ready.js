const BaseEvent = require('../../utils/structures/BaseEvent');
const fetch = require('node-fetch');
let settings = { method: "Get" };
const Discord = require('discord.js');
const he = require('he');
var fs = require('fs');
var mysql = require('mysql');
const { get } = require('http');
const { on } = require('process');

var con = mysql.createConnection("mysql://p25tggy3yuum47z4:qobzrmi5bj6u35ib@f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/orb72zev1k83i9im");
//con.connect(function(err){if(err) throw err; console.log("connected")});

function GetFile(){
  return new Promise(function(resolve,reject){
  con.query("select filestring from commandsettings where id = 1", function(err,result){  
    if (err) {
      reject(err);
    }else{resolve(JSON.parse(result[0].filestring));}
  })
});
}

async function fetchAsync(urlstring) {
  let response = await fetch(urlstring);
  let data = await response.json();
  return data;
}
function agestring(age) {
  if (age == 1) {
    var ageString = "il y a 1 An";
  } else {
    var ageString = "il y a " + age + " Ans";
  }
  return ageString;
}

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client) {
    
    var file =  await GetFile();
    const hourReady = file.hour;
    const idCReady = file.idchannel;
    console.log(file.idchannel);
    
    if (file.running) {
      
      client.channels.cache.find(x => x.id == file.idchannel).send("Le bot a été demarré et a trouvé qu'une commande a été lancée tout les jours a " + file.hour + "h sur ce salon" );
      let videos = new Array;

      function remaining() {
        let Time = new Date();
        Time.setHours(file.hour);
        Time.setMinutes(0);
        Time.setSeconds(0);
        if (new Date().getHours() >= file.hour) {
          Time.setDate(new Date().getDate() + 1);
        }
        console.log(Time.getTime() - new Date().getTime()); 
        return (Time.getTime() - new Date().getTime());
      }
      //lance une premiere fois le code une fois l'heure indiquée en argument atteinte, elle est ensuite relancée recurcivement a la meme heure le lendemain.
      await setTimeout(async function () { check() }, /*remaining()*/0);

      async function check() {

        async function canRun(){
          var file = await GetFile();
          if(file.running && file.hour == hourReady && file.idchannel == idCReady){
            check()}
            
            // verifie si les valeurs n'ont pas changé avant de faire un rappel de la fonction.
            //si elles ont changé, cela veut dire que c'est appel n'a plus lieu et qu'il a juste
            //été gardé a cause du setTimeout qui n'etais pas terminé
        } 

        var today = new Date();
        var tommorow = today;
        var yesterday = today;
        tommorow.setDate(today.getDate() + 1);
        yesterday.setDate(today.getDate() - 1);


        // le for fais une demande API a la date actuelle tout les ans de maintenant a la creation de la chaine pour trouver tout les anniversaires.
        for (var year = today.getUTCFullYear() - 1; year >= 2016; year--) {

          let url = "https://www.googleapis.com/youtube/v3/search?part=snippet"
            + "&key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU"
            + "&type=video"
            + "&channelId=UCRzYFQvpcyLj0EhL5JQOGfQ"
            + "&fields=items(snippet(publishedAt,title),id(videoId))"
            + "&publishedBefore=" + year + "-" + (tommorow.getUTCMonth() + 1) + "-" + tommorow.getUTCDate() + "T00:00:00Z"
            + "&publishedAfter=" + year + "-" + (yesterday.getUTCMonth() + 1) + "-" + yesterday.getUTCDate() + "T23:59:59Z"
            + "&maxResults=25";

          //url pour avoir acces au json en hebergant sur xampp (le developpement utilise rapidement le quota de l'API, fetch() demande du http)
          var url2 = "http://file.local/search.json";
          try {
            var data = await fetchAsync(url);
          } catch (error) { // si le fichier n'est pas trouvé (pas de co, etc...)
            console.log("le fichier json est inaccessible");
            await setTimeout(async function () { canRun() }, 1000 * 3600);
            return;
          }
          if (!("error" in data)) {
            for (var element in data.items) {
              var Tags = await fetchAsync("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU&type=video&id=" + data.items[element].id.videoId + "&part=snippet&fields=items(snippet(tags))");
              Tags = Tags.items[0].snippet.tags;
              if (!Tags.includes("no-bot")) {
                var video = { "titre": he.decode(data.items[element].snippet["title"]), "id": data.items[element].id.videoId, "Date": new Date(data.items[element].snippet["publishedAt"]) };
                videos.push(video);
              }
            }
          } else { // si le fichier json contient une erreur (Quota atteint)
            console.log(data.error);
            await setTimeout(async function () { canRun() }, 1000 * 3600);
            return;
          }
        }
        if (videos.length == 0) {
          await setTimeout(async function () { canRun() },/* remaining()*/10000);
          console.log("pas de videos le " + new Date());
          return;
        }

        //creation du message avec les paramettre communes independantes du nombre de videos
        const sayEmbed = new Discord.MessageEmbed()
          .setFooter('Le Best Bot')
          .setThumbnail('https://img.icons8.com/cotton/2x/birthday-cake.png')
          .setColor("#" + Math.floor(Math.random()*16777215).toString(16)) //couleur random en hex
          .setTimestamp();
        //changements particuliers sur le message puis envoi pour n'envoyer que s'il y a un message
        if (videos.length == 1) {
          sayEmbed.setTitle("C'EST L'ANNIVERSAIRE D'UNE VIDEO AUJOURD'HUI");
        } else {
          sayEmbed.setTitle("C'EST L'ANNIVERSAIRE DE " + videos.length + " VIDEOS AUJOURD'HUI");
        }
        var liens = "";
        videos.forEach(element => {
          sayEmbed.addField(element.titre, agestring(today.getUTCFullYear() - element.Date.getUTCFullYear()));
          liens = liens + "https://youtu.be/" + element.id + "\n";
        })
        await client.channels.cache.find(x => x.id == file.idchannel).send(sayEmbed);
        client.channels.cache.find(x => x.id == file.idchannel).send(liens);
        console.log("fin");
        await setTimeout(async function () { canRun()}, /*remaining()*/5000);

      }
    }
    
    
  }
}