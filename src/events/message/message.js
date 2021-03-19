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
                                     "est-ce",
                                     "qui");

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
      if(!GlobalVars.IsChiant) return;
      if(message.content.includes("http") || message.attachments.size >0) return;
      var contentstring =  message.content.toLowerCase();

      var isquestion = false;
      QuestionSentenceList.forEach(element => {
        if (contentstring.startsWith(element)|| contentstring.endsWith(element)) isquestion = true;

      });
    
        switch(message.content[message.content.length -1]){
          case '.' : break;
          case '!' : break;
          case '?' : break;
          case ';' : break;
          case ':' : break;
          case ',' : break;
          default : if(isquestion){
            message.channel.send(message.content + '? <@!' + message.author + '>');
          }else{
            message.channel.send(message.content + '. <@!'+ message.author + '>');
          } 
        
      }
    }
  }
}
