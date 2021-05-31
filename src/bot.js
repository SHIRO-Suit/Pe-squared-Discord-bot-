require('dotenv').config();
const { Client } = require('discord.js');
const { commands, events } = require('../commandsChecker.js');
const json = require('../commandsFetchList.json');
const client = new Client();
module.exports = {client};

(async () => {
  await client.login(process.env.TOKEN);
  await client.api.applications('785217364769636362').guilds('304660884482162688').commands.post(json);
  client.ws.on('INTERACTION_CREATE', async interaction => {
    commands(interaction);
  });
})();
client.on('message', msg => {
  events('message',msg);
});
client.on('ready',()=>{
    events('ready');
})


