const BaseCommand = require('../../utils/structures/BaseCommand');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const he = require('he');
const mysql = require('mysql');
const con = mysql.createConnection("mysql://p25tggy3yuum47z4:qobzrmi5bj6u35ib@f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/orb72zev1k83i9im");
var GlobalVars = require('../../../GlobalVars');



/////////  FONCTION GLOBALES  /////////////

function GetFile() { 
  return new Promise(function (resolve, reject) {
    con.query("select filestring from commandsettings where id = 1", function (err, result) {
      if (err) {
        reject(err);
      } else { resolve(JSON.parse(result[0].filestring)) }
    })
  })
}
function UpdateFile(file) {
  con.query("update commandsettings set filestring = '" + JSON.stringify(file) + "' where id = 1", function (err, result) { })
}
function agestring(age) {
  var agestring = "il y a " + age + " An";
  if (age != 1) { agestring += "s" }
  return agestring;
}
async function fetchAsync(urlstring) {
  let response = await fetch(urlstring);
  let data = await response.json();
  return data;
}

///////// DEBUT EXECUTION SCRIPT  ////////////

module.exports = class VideosCommand extends BaseCommand {
  constructor() {
    super('videos', 'idk', []);
  }

  async run(client, message, args) {

    ///////////  VERIFICATIONS  /////////////

    if (message.author != "256838525750738946") { return } //acces limité : Moi

    if (isNaN(args[0]) || args[0] > 23) {
      message.channel.send("Syntaxe Incorrecte: ²Videos suivi de (0 à 23)");
      return;
    }

    /*if (file.running) {
      message.channel.send("la commande a déjà été lancée sur le serveur, si vous voulez la relancer dans un autre salon ou a une autre horaire faites d’abord la commande ²stop");
      return;
    }*/
    
    var file = await GetFile();
    file.idchannel = message.channel.id;
    file.hour = args[0];
    file.running = false; // reinitialise pour que le calcul des heures dans remaining() se fasse correctement. uniquement quand la commande est lancée ou changée de salon 
    await UpdateFile();
    

    message.channel.send("Heure commande journalière : " + file.hour + "h\nPour l'annuler entrez ²stop");
    console.log("OnCommand: CommandCycle.Status = running  CommandCycle.Time = " + file.hour);
    let videos = new Array;

    ///////// FONCTIONS INTERNES /////////

    function remaining() {
      let result = 0;
      let Time = new Date();
      let HourNow = Time.getHours();
      Time.setUTCHours(file.hour, 0, 0);
      if (HourNow >= file.hour ) {
        if (!(HourNow == file.hour && !file.running)){
          Time.setDate(new Date().getDate() + 1);
          result = Time.getTime() - (new Date().getTime() - new Date().getTimezoneOffset()*60000);
        }
      }else {
        result = Time.getTime() - (new Date().getTime() - new Date().getTimezoneOffset()*60000);
      }
      console.log("Remaining: " +Math.trunc(result / 3600000) + ":" + Math.round((result % 3600000)/60000 ));
      return result;
    }

    async function DelayedMessage(duration) {
      file.running = true;
      await UpdateFile(file);
      clearTimeout(GlobalVars.GlobalTimer);
      GlobalVars.GlobalTimer = await setTimeout(async function () { check() }, duration);
    }
    //////// REEL LANCEMENT DE LA FONCTION  //////////

    DelayedMessage(remaining()); // R
    async function check() {

      var file = await GetFile();
      // if (!(file.running && file.hour == args[0] && file.idchannel == message.channel.id)) {
      //   return;
      // } // vérifie si la commande n'est pas obsolète 
      //plus necessaire puisque la commande annule la précedente.
      

      var today = new Date();
      var tommorow = new Date();
      var yesterday = new Date();
      tommorow.setDate(new Date().getDate() + 1);
      yesterday.setDate(new Date().getDate() - 1);
      
      if(today.getHours() < file.hour && file.err != 0){ 
        console.log(today.getUTCHours() - file.hour < 0);
        file.err = 0;
        await UpdateFile(file);
        message.channel.send("Les tentatives de resoudre les erreurs n'ont pas abouti avant minuit,\nla commande ne sera pas efectuée, lancement de la commande du lendemain <@!256838525750738946>");
        DelayedMessage(remaining());
        return;
      }
      if (file.err == 3) {
        message.channel.send("il y a eu 3 erreurs consécutives <@!256838525750738946>");
      }



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
          let url3 = "https://www.googleapis.com/youtube/v3/search?part=snippet"
          + "&key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU"
          + "&type=video"
          + "&channelId=UCRzYFQvpcyLj0EhL5JQOGfQ"
          + "&fields=items(snippet(publishedAt,title),id(videoId))"
          + "&publishedBefore=" + year + "-11-01T00:00:00Z"
          + "&publishedAfter=" + year + "-10-30T23:59:59Z"
          + "&maxResults=25";
        //url pour avoir acces au json en hebergant sur xampp (le developpement utilise rapidement le quota de l'API, fetch() demande du http)
        var url2 = "http://file.local/search.json";

        /////////// VERIFICATION ERREURS ///////////

        try {
          var data = await fetchAsync(url2); // throw une exception si erreur de connexion.
          if (("error" in data)) { throw 'Erreur de Quota ou Autre' }
          
          /////////// VIDEOS FILTREES DANS UN TABLEAU  /////////
          
          for (var element in data.items) {
            var Tags = await fetchAsync("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBz7c52lt1mbJmNgOMpNol9x4GWWHGcgqU&type=video&id=" + data.items[element].id.videoId + "&part=snippet&fields=items(snippet(tags))");
            if (!Tags.items[0].snippet.tags.includes("no-bot")) {
              var video = { "titre": he.decode(data.items[element].snippet["title"]), "id": data.items[element].id.videoId, "Date": new Date(data.items[element].snippet["publishedAt"]) };
              videos.push(video);
            }
          }
        } catch (err) {
          console.log(err);
          file.err += 1;
          await UpdateFile(file);
          DelayedMessage(3600000);
          return;
        }
        
      }

      file.err = 0;
      await UpdateFile(file);
      if (videos.length == 0) {
        DelayedMessage(remaining());
        console.log("Pas de videos Today");
        return;
      }
      /////////// FABRICATION DU MESSAGE /////////

      const sayEmbed = new Discord.MessageEmbed()
        .setFooter('Le Best Bot', message.author.displayAvatarURL())
        .setThumbnail('https://img.icons8.com/cotton/2x/birthday-cake.png')
        .setColor("#" + Math.floor(Math.random() * 16777215).toString(16)) //couleur random en hex
        .setTimestamp();
      if (videos.length == 1) {
        sayEmbed.setTitle("C'EST L'ANNIVERSAIRE D'UNE VIDEO AUJOURD'HUI")
      } else {
        sayEmbed.setTitle("C'EST L'ANNIVERSAIRE DE " + videos.length + " VIDEOS AUJOURD'HUI")
      }
      var liens = "";
      videos.forEach(element => {
        sayEmbed.addField(element.titre, agestring(today.getUTCFullYear() - element.Date.getUTCFullYear()));
        liens = liens + "https://youtu.be/" + element.id + "\n";
      })
      await message.channel.send(sayEmbed);
      message.channel.send(liens);
      videos = [];
      DelayedMessage(remaining());
    }
  }

}
