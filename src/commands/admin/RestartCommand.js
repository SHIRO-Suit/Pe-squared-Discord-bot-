const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RestartCommand extends BaseCommand {
  constructor() {
    super('restart', 'admin', []);
  }

  run(client, message, args) {
    message.channel.send('Restarting...');
    process.exit();
  }
}