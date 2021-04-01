module.exports = { commands };
async function commands(interaction){
    const command = require("./interractions/"+ interaction.data.name + ".js");
    command[interaction.data.name](interaction);
}

