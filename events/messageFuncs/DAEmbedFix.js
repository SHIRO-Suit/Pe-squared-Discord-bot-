module.exports = {DeviantArtEmbed};
const fetch = require('node-fetch');
const Discord = require('discord.js');

async function DeviantArtEmbed(msg) {
    if (msg.author.bot) return;
    if (!msg.content.includes("deviantart")) return;
    
    var urls = msg.content.split(" ");
    var uniques = urls.filter((x, i) => i === urls.indexOf(x))

    for (var url of uniques) {
        if (!url.includes("deviantart")) continue;

        r = await fetch('https://backend.deviantart.com/oembed?url=' + url, { method: 'post' });
        r = await r.json();
        
         messageEmbed = new Discord.MessageEmbed()
            .setColor('#05cc46')
            .setTitle(r.title)
            .setURL(url)
            .setAuthor('DeviantArt', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/479ab6ca-88d0-4518-b430-7609318768f8/d8ix39x-0aafc1ff-a9ec-40dd-acff-2117220ffc02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi80NzlhYjZjYS04OGQwLTQ1MTgtYjQzMC03NjA5MzE4NzY4ZjgvZDhpeDM5eC0wYWFmYzFmZi1hOWVjLTQwZGQtYWNmZi0yMTE3MjIwZmZjMDIucG5nIn1dXX0.GGM13RBPw_LyxNi1yOiV9JQyWAq5kyJTYq5s4UfIgqM', 'https://www.deviantart.com')
           .setThumbnail(await AuthorImg(r.author_name))
            .addField('Artist :', r.author_name)
            .setImage(r.url);
        

            
            //await WaitForEmbeds(msg.embeds);
            
            WaitForEmbeds().then(function (){
                var embExists = false;
                for(var embed of msg.embeds){
                    if(embed.url == url){   
                        embExists = true;
                        break;
                    }
                }
                if(!embExists){msg.channel.send(messageEmbed)}
                console.log('sent');
            });
    }
    function WaitForEmbeds(){
        return new Promise(function(resolve){
            var trycount = 0;
            waitInterval = setInterval(function() {
                if(trycount < 20 && msg.embeds.length == 0){
                trycount++;
                }else{
                    clearInterval(waitInterval);
                    resolve();
                }
            },100); 
        })  
    }
}




async function AuthorImg(author) {
    author = author.toLowerCase()
    var first, second;
    [first,second] = [author[0],author[1]];
    if(first == '-')first = '_';
    if(second == '-')second = '_';
    var authorImage = 'https://a.deviantart.net/avatars-big/' + first + '/' + second + '/' + author;
    var earliest = new Date(0);
    var goodurl;
    let promises = [];
    promises.push(fetch(authorImage +".jpg"));
    promises.push(fetch(authorImage +".png"));
    promises.push(fetch(authorImage +".gif"));
    await Promise.all(promises).then(files =>{
        for(var file of files){
            if(file.status ==200){
                if(DateParse(file.headers.raw()['last-modified'][0]) > earliest){  
                    earliest = DateParse(file.headers.raw()['last-modified'][0]);
                    goodurl = file.url;
                }
            }
        }
    });
    return goodurl;
}

function DateParse(Datestring){
    
    if(Datestring === undefined) return new Date(0);
    var month = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
        jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
    Datestring = Datestring.split(", ")[1];
    var datearg = Datestring.split(" ");
    var dateargH = datearg[3].split(":");
    return new Date(datearg[2],month[datearg[1].toLowerCase()],datearg[0],dateargH[0],dateargH[1],dateargH[2]);

}