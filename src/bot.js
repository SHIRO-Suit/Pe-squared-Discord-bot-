require('dotenv').config();
//import('../commandsReg.js');
const { Client,Message } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const { commands, events } = require('../commandsChecker.js');
const client = new Client();
module.exports = {client};

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = process.env.DISCORD_BOT_PREFIX;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
  await client.api.applications('785217364769636362').guilds('304660884482162688').commands.post({data: {
    name: 'ping',
    description: 'ping pong!'
  },data:{
    name: 'dotannoy',
    description: 'Active/Désactive le mode chiant sur la correction de la ponctuation.'
  },data:{
    name: 'poop',
    description: 'Encapsule avec poop.',
    options:[{
      name:'Phrase',
      description : 'Phrase à encapsuler',
      type: 3,
      required: true
    }]
  },data:{
      name:'videobirthday',
      description: 'Lance la fonction quotidienne d\'anniversaire de vidéo dans le salon actuel.',
      options:[{
          name:'heure',
          description:'heure quotidienne de la commande (0-23)',
          type : 4
      }]
  },data:{
      name: 'updatevideos',
      description: 'mets a jour la DB des vidéos'
  }
});
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


