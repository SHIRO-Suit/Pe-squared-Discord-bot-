const { client } = require('../src/bot.js');
module.exports={poop};
function poop(interaction){
    console.log(
    interaction);
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: ''
        }
      }})
}