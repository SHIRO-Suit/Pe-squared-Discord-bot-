module.exports={miku};
const { client } = require('../bot.js');

function miku(interaction){
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: response
        }
      }})
}

response = "You’ve seen 👀 Miku on 🔛 stage 👄, but 🍑 what about 💦 your 👉 wrist ⌚💯?\n"
          +"Wrist ⌚💯 World 🌎 is an AR 💰 game 🎮🎰🎳 using 😏 wristbands, now featuring 🎥 Hatsune Miku!\n"
          +"Collect ⚗ songs 🎶, dances 💃, and even 🌃 save 📑 the world 🌎! Do You 👀👉👱 Wrist ⌚ World 🌎? wrist ⌚ world 🌎";