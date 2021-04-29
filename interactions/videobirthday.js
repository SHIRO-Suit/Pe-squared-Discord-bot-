module.exports={videobirthday};
const { client } = require('../src/bot.js');
const mysql = require('mysql');
const con = mysql.createConnection("mysql://p25tggy3yuum47z4:qobzrmi5bj6u35ib@f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/orb72zev1k83i9im");
async function videobirthday(interaction){
    var message;
    if(interaction.data.options[0].value <0 ||
       interaction.data.options[0].value >23)
    { message = "L'heure spécifiée doit être un nombre entre (0-23)" }
    else{
    const query = new Promise(resolve =>{ con.query("UPDATE Settings Set ChannelExecID ="+interaction["channel_id"]+",HourExec="+ interaction.data.options[0].value+ ";", (err, result) =>{
        if(err){  message = '🛑 erreur de connexion à la base de données. Reessayez plus tard.';}
        if(result){  message = '✅ Le bot est paramétré à ' + interaction.data.options[0].value + 'h sur ce salon';}
        resolve();
    });
    });
    await query;
    }
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: message
        }
      }})
}