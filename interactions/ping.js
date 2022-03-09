
const { client } = require('../bot.js');
module.exports={ping};
function ping(interaction){
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: "🏓 **Pong!** `"+client.ws.ping + "ms`"
        }
      }});
     
      
    }
