const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
var fs = require('fs');
module.exports = class TestjsonCommand extends BaseCommand {
  constructor() {
    super('t', 'test', []);
  }

  run(client, message, args) {
    console.log(message.channel.id);
    message.channel.send('Testjson command works');
    client.channels.cache.get(message.channel.id).send("j'ai reussi a envoyer dans le channel demandé");
    if (args[0] === undefined || !Number.isInteger(parseInt(args[0])) || args[0] > 23) {
      message.channel.send("Erreur : vous devez specifier une horaire. Ex:  ²videos 14");
    } else {
    var jsonvalue =  {"idchannel" : message.channel.id , "hour" : args[0], "running" : true};
    var jsonV =  JSON.stringify(jsonvalue);
    fs.writeFile("test.json", jsonV, function(err,result){
      if(err) console.log('error',err);
    });
    }
    
  }
}