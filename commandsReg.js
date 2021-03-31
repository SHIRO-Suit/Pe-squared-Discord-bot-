const fetch = require('node-fetch');

url = "https://discord.com/api/v8/applications/785217364769636362/guilds/304660884482162688/commands"

json = {
    "name": "Test Slash",
    "description": "Teste le slash"
}

// // For authorization, you can use either your bot token
// headers = {
//     "Authorization": "Bot 123456"
// }
// // or a client credentials token for your app with the applications.commands.update scope
// headers = {
//     "Authorization": "Bearer abcdefg"
// }

r = fetch(url)