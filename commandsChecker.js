module.exports = { commands, events };
async function commands(interaction){
    const command = require("./interactions/"+ interaction.data.name + ".js");
    command[interaction.data.name](interaction);
}

async function events(eventType,args){
    const event = require("./events/"+ eventType + ".js");
    event[eventType](args);
}