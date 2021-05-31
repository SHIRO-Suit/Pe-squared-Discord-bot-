module.exports={videobirthday};
const { client } = require('../src/bot.js');
const {con} = require('../GlobalVars.js');

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