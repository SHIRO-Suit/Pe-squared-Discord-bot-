const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PoopCommand extends BaseCommand {
  constructor() {
    super('poop', 'poop', []);
  }

  run(client, message, args) {
    message.channel.send("poop "+args +" poop");
  }
}