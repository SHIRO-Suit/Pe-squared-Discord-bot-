const BaseCommand = require('../../utils/structures/BaseCommand');
var GlobalVars = require('../../../GlobalVars');

module.exports = class DotAnnoyCommand extends BaseCommand {
  constructor() {
    super('DotAnnoy', 'Misc', []);
  }

  run(client, message, args) {
    message.channel.send('Le mode Chiant a été activé');
    GlobalVars.IsChiant = true;
    setTimeout(function() {
      GlobalVars.IsChiant = false;
      message.channel.send('Le mode Chiant a été désactivé');
    },3600 * 1000)
  }
}