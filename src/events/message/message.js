const BaseEvent = require('../../utils/structures/BaseEvent');
var GlobalVars = require('../../../GlobalVars');
var QuestionSentenceList = new Array("comment",
                                     "qu'est",
                                     "keske",
                                     "quoi",
                                     "what",
                                     "how",
                                     "why",
                                     "eske",
                                     "est ce",
                                     "pourquoi",
                                     "est-ce");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    if (message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }else{
      var contentstring =  message.content.toLowerCase();
      if(!GlobalVars.IsChiant) return;
      var isquestion = false;
      QuestionSentenceList.forEach(element => {
        if (contentstring.startsWith(element)) isquestion = true;
      });
    
        switch(message.content[message.content.length -1]){
          case '.' : break;
          case '!' : break;
          case '?' : break;
          default : if(isquestion){
            message.channel.send('?');
          }else{
            message.channel.send('.');
          } 
        
      }
    }
  }
}