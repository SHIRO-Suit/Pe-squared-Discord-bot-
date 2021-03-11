const BaseCommand = require('../../utils/structures/BaseCommand');
var GlobalVars = require('../../../GlobalVars');

module.exports = class StopAnnoyCommand extends BaseCommand {
  constructor() {
    super('StopAnnoy', 'misc', []);
  }

  run(client, message, args) {
    message.channel.send('Le mode Chiant a été désactivé');
    GlobalVars.IsChiant = false;

  }
}