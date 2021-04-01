const { client } = require('../src/bot.js');
module.exports={poop};
function poop(interaction){
    interaction.data.
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: ''
        }
      }})
}