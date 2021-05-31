module.exports={addevent};
const { client } = require('../src/bot.js');
const {con} = require('../GlobalVars.js');

async function addevent(interaction){
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


    
    var insertstring = '(\'!#event\',\"'+ interaction.data.options[3].value+'\",\''+new Date(interaction.data.options[0].value,interaction.data.options[1].value-1,interaction.data.options[2].value).toISOString().substring(0,19)+'Z'+'\')';

    

    var sqlquery= 'Insert into Videos values' + insertstring + ';';
    const query = new Promise(resolve =>{ con.query(sqlquery,  (err, result) =>{
        if(err){  message = '🛑 erreur de connexion à la base de données. Reessayez plus tard.'; console.log(err);}
        if(result){message = '✅ La base de données a été mise a jour ('+result.affectedRows+' lignes Ajoutées)\n'+
        'Ajout de "'+interaction.data.options[3].value+'" Le '+interaction.data.options[2].value+'/'+interaction.data.options[1].value+'/'+interaction.data.options[0].value;}
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