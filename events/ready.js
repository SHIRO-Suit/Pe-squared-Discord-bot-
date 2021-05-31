module.exports = {ready};
const Discord = require('discord.js');
//const fetch = require('node-fetch');
const mysql = require('mysql');
const con = mysql.createConnection("mysql://p25tggy3yuum47z4:qobzrmi5bj6u35ib@f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/orb72zev1k83i9im");
const {client} = require("./../src/bot")
var Today = new Date(); //"2021-03-21T10:02:39Z" pour test
var Timer;

async function ready(){
    
    TryMsgErrHandle()
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
    console.log( Today.getHours());
    if(Settings[0].HourExec <= Today.getHours()-2)return;

    var later = new Date();
        later.setHours(Settings[0].HourExec,0,0,0);        
        clearInterval(Timer);

    const Embedbase = new Discord.MessageEmbed()
          .setFooter('Le Best Bot')
          .setThumbnail('https://img.icons8.com/cotton/2x/birthday-cake.png')
          .setColor("#" + Math.floor(Math.random() * 16777215).toString(16)) //couleur random en hex
          .setTimestamp();
          var liens = "";
         
     getBirthday("video").then(data => {
        if(data.length== 0)return;
        const Embed1 = new Discord.MessageEmbed(Embedbase);
        if (data.length == 1) {
            Embed1.setTitle("C'EST L'ANNIVERSAIRE D'UNE VIDEO AUJOURD'HUI");
          } else {
            Embed1.setTitle("C'EST L'ANNIVERSAIRE DE " + data.length + " VIDEOS AUJOURD'HUI");
          }


        for (var video of data) {
            Embed1.addField(video.Title, agestring(Today.getUTCFullYear() - new Date(video.PublishedAt).getUTCFullYear()));
            liens += "https://youtu.be/" + video.VideoID + "\n";
        }
        setTimeout(()=>{
        client.channels.fetch(Settings[0].ChannelExecID).then(channel =>{
            channel.send(Embed1);
            channel.send(liens);
            deleteBDay(data);
        })}, later.getTime() - new Date().getTime()
        )
    })
    getBirthday("event").then(data2 =>{
        if(data2.length== 0)return;
        const Embed2 =  new Discord.MessageEmbed(Embedbase);
        Embed2.setTitle('Aujourd\'hui')
        for (var event of data2){
            Embed2.addField(event.Title, agestring(Today.getUTCFullYear() - new Date(event.PublishedAt).getUTCFullYear()));
        }
        setTimeout(()=>{
        client.channels.fetch(Settings[0].ChannelExecID).then(channel =>{
            channel.send(Embed2);
        })}, later.getTime() - new Date().getTime())
    })
    
    
}



function deleteBDay(data){
    return new Promise(function (resolve, reject) {
        for(var video of data){
        con.query("delete from Videos where VideoID = "+video.VideoID + ";", function (err) { if (err) reject(err) });
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
function getBirthday(string){
    var TodayQ = Today.toISOString().slice(5,10);
    if(string == "video"){
        var query = "select * from Videos where PublishedAt like \'%" + TodayQ + "T%\' and VideoID != \'!#event\' "
    }else if (string == "event"){
        var query = "select * from Videos where PublishedAt like \'%" + TodayQ + "T%\' and VideoID = \'!#event\' "
    }
    console.log(query);
    return new Promise(function (resolve, reject) {
        con.query(query, function (err, result) {
          if (err) {
            reject(err);
          } else if (result) { console.log("result = "+result);resolve(result) }else{
              resolve()
          }
        })
      })
}


function agestring(age) {
    var agestring = "il y a " + age + " An" + ((age == 1) ? "" : "s");
    return agestring;
  }