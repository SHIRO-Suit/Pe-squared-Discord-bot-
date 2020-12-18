const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PopCommand extends BaseCommand {
  constructor() {
    super('pop', 'pop', []);
  }

  run(client, message, args) {
    message.channel.send('pop command works');
  }
}