const { client } = require('../src/bot.js');
module.exports={poop};
function poop(interaction){
    var response = '💩 '+ interaction.data.options[0].value + ' 💩';

    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: response
        }
      }})
}