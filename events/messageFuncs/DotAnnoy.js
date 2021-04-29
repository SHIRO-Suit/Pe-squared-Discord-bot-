module.exports = {DotAnnoyMessage};
const {isurl,hasAttach} = require("./baseMessageFuncs");
var QuestionSentenceList = new Array("comment", "qu'est", "keske", "quoi", "what", "how", "why", "eske", "est ce", "pourquoi", "est-ce", "qui");


function DotAnnoyMessage(msg) {
    if (msg.author.bot) return;
    if (isurl(msg.content) || hasAttach(msg)) return;
    var contentstring = msg.content.toLowerCase();

    var isquestion = false;
    QuestionSentenceList.forEach(element => {
        isquestion = isquestion || contentstring.startsWith(element) || contentstring.endsWith(element);
    });

    switch (msg.content[msg.content.length - 1]) {
        case '.': break;
        case '!': break;
        case '?': break;
        case ';': break;
        case ':': break;
        case ',': break;
        default: if (isquestion) {
            msg.reply(msg.content + '?');
        } else {
            msg.reply(msg.content + '.');
        }
    }
}