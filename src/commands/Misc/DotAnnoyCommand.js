const BaseCommand = require('../../utils/structures/BaseCommand');
var GlobalVars = require('../../../GlobalVars');
var Timeout;
module.exports = class DotAnnoyCommand extends BaseCommand {
  constructor() {
    super('DotAnnoy', 'Misc', []);
  }

  run(client, message, args) {
    
    if(GlobalVars.IsChiant == false){
    message.channel.send('Le mode Chiant a été activé (30 min sauf si stoppé avant)');
    GlobalVars.IsChiant = true;
    Timeout = setTimeout(function() {
      GlobalVars.IsChiant = false;
      message.channel.send('Le mode Chiant a été désactivé');
    },1800 * 1000)
    }else{
      if(Timeout){clearTimeout(Timeout)}
      GlobalVars.IsChiant = false
      message.channel.send('Le mode Chiant a été désactivé');
      
    }
  }
}