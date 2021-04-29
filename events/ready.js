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
    if(Settings[0].HourExec < Today.getHours()-2)return;
    const Embed = new Discord.MessageEmbed()
          .setFooter('Le Best Bot')
          .setThumbnail('https://img.icons8.com/cotton/2x/birthday-cake.png')
          .setColor("#" + Math.floor(Math.random() * 16777215).toString(16)) //couleur random en hex
          .setTimestamp();
          var liens = "";
         
     getBirthday().then(data => {
        if(data.length== 0)return;
        if (data.length == 1) {
            Embed.setTitle("C'EST L'ANNIVERSAIRE D'UNE VIDEO AUJOURD'HUI");
          } else {
            Embed.setTitle("C'EST L'ANNIVERSAIRE DE " + data.length + " VIDEOS AUJOURD'HUI");
          }


        for (var video of data) {
            Embed.addField(video.Title, agestring(Today.getUTCFullYear() - new Date(video.PublishedAt).getUTCFullYear()));
            liens += "https://youtu.be/" + video.VideoID + "\n";
        }
        var later = new Date();
        later.setHours(Settings[0].HourExec,0,0,0);        
        clearInterval(Timer); // ne va le clear que s'il est instancié soit, s'il y a deja eu une erreur
        setTimeout(()=>{
        client.channels.fetch(Settings[0].ChannelExecID).then(channel =>{
            channel.send(Embed);
            channel.send(liens);
            deleteBDay(data);
        })}, later.getTime() - new Date().getTime()
        )
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
function getBirthday(){
    var TodayQ = Today.toISOString().slice(5,10);
    return new Promise(function (resolve, reject) {
        con.query("select * from Videos where PublishedAt like \'%" + TodayQ + "T%\'", function (err, result) {
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