const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PopCommand extends BaseCommand {
  constructor() {
    super('pop', 'popo', []);
  }

  run(client, message, args) {
    message.channel.send('pop command works');
  }
}