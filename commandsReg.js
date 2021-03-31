const fetch = require('node-fetch');
const Discord = require('discord.js');
const botToken = 'Nzg1MjE3MzY0NzY5NjM2MzYy.X80oqA.y146FnMh-WoR-pvcncFSnXt6Uf8';

url = "https://discord.com/api/v8/applications/785217364769636362/guilds/304660884482162688/commands";

json = {
    "name": "Test Slash",
    "description": "Teste le slash"
}

// For authorization, you can use either your bot token
// headers = {
//     "Authorization": "Bot Nzg1MjE3MzY0NzY5NjM2MzYy.X80oqA.y146FnMh-WoR-pvcncFSnXt6Uf8",
//     'Content-Type': 'application/json'
// }
// // or a client credentials token for your app with the applications.commands.update scope
// headers = {
//     "Authorization": "Bearer abcdefg"
// }
r = fetch(url,{
    method: 'post',
    body: JSON.stringify(json),
    headers: {
      'Authorization': 'Bot ' + botToken,
      'Content-Type': 'application/json'
    }
});

setTimeout(function(){
    console.log(r);
},10000);
    
