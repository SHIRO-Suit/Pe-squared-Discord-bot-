require('dotenv').config();
//import('../commandsReg.js');
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client();
client.api.applications(client.user.id).guilds('304660884482162688').commands.post({data: {
  name: 'ping',
  description: 'ping pong!'
}});
(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = process.env.DISCORD_BOT_PREFIX;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

