module.exports = { message };
const {DotAnnoyMessage} = require("./messageFuncs/DotAnnoy.js");
const {DeviantArtEmbed} = require("./messageFuncs/DAEmbedFix.js");
const {isurl,hasAttach } = require("./messageFuncs/baseMessageFuncs.js");

function message(msg) {
    var { IsChiant } = require('../GlobalVars');
    if (IsChiant) { DotAnnoyMessage(msg) }
    if (isurl(msg.content)) { DeviantArtEmbed(msg) }
}




