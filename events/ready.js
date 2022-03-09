module.exports = {ready};
const Discord = require('discord.js');
const {con} = require('../GlobalVars.js');
const {client} = require("../bot.js")
var Today = new Date(); //"2021-03-21T10:02:39Z" pour test
var Timer;

async function ready(){
    console.log("Ready OK");
    TryMsgErrHandle();
}

function TryMsgErrHandle(){
    try{msg()}
catch(e){
console.log(e);
Timer = setInterval(()=>{
    try{msg()}
   catch(err){
       console.log(err);
       return;
   }},1800000)
}
}

async function msg() {
    const Settings = await getSettings();
    if(Settings[0].HourExec <= Today.getHours()-2)return;

    var later = new Date();
        later.setHours(Settings[0].HourExec,0,0,0);        
        clearInterval(Timer);

    const Embedbase = new Discord.MessageEmbed()
          .setFooter('Le Best Bot')
          .setThumbnail('https://img.icons8.com/cotton/2x/birthday-cake.png')
          .setColor("#42f551") 
          .setTimestamp();
    var liens = "";
    

     getBirthday().then(data => {
        if(data.length== 0)return;

        const EmbedVideo = new Discord.MessageEmbed(Embedbase);
        const EmbedEvent = new Discord.MessageEmbed(Embedbase);
        var videosL = 0;

        for (var item of data) {
            if(item.VideoID !== '!#event'){
                EmbedVideo.addField(item.Title, agestring(Today.getUTCFullYear() - new Date(item.PublishedAt).getUTCFullYear())); console.log("passe par la ")
                liens += "https://youtu.be/" + item.VideoID + "\n";
                videosL++;
            }else{
                EmbedEvent.addField(item.Title, agestring(Today.getUTCFullYear() - new Date(item.PublishedAt).getUTCFullYear()));
            }
        } 
        EmbedVideo.setTitle("C'EST L'ANNIVERSAIRE D" +((videosL == 1) ? "'UNE VIDEO" : ("E " + videosL + " VIDEOS")) +" AUJOURD'HUI");
        EmbedEvent.setTitle('Aujourd\'hui');
        setTimeout(()=>{
        client.channels.fetch(Settings[0].ChannelExecID).then(channel =>{
            if(EmbedVideo.fields.length != 0){
            channel.send(EmbedVideo);
            channel.send(liens);}
            if(EmbedEvent.fields.length != 0){ channel.send(EmbedEvent) }
            deleteBDay(data);
        })},0// later.getTime() - new Date().getTime()
        )
    })
}

function deleteBDay(data){
    return new Promise(function (resolve, reject) {
        for(var item of data){
            console.log(item.VideoID);
        if(item.VideoID == '!#event') continue;
        con.query("delete from Videos where VideoID = \'"+item.VideoID + "\';", function (err) { if (err) reject(err) });
        }
        resolve();
    })
}

function getSettings(){
    return new Promise(function (resolve, reject) {
        con.query("select * from Settings", function (err, result) {
          if (err) {
            reject(err);
          } else if (result) { resolve(result) }
        })
      })
}
function getBirthday(){
    var TodayQ = Today.toISOString().slice(5,10);   
    var query = "select * from Videos where PublishedAt like \'%" + TodayQ + "T%\';";
    return new Promise(function (resolve, reject) {
        con.query(query, function (err, result) {
          if (err) {
            reject(err);
          } else if (result) { resolve(result) }else{
              resolve()
          }
        })
      })
}

function agestring(age) {
    var agestring = "il y a " + age + " An" + ((age == 1) ? "" : "s");
    return agestring;
  }