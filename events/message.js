module.exports={message};
const Discord = require('discord.js');
const fetch = require('node-fetch');

var QuestionSentenceList = new Array("comment","qu'est","keske","quoi","what","how","why","eske","est ce","pourquoi","est-ce","qui");

function message(msg){
    var {IsChiant} = require('../GlobalVars');
    if(IsChiant){DotAnnoyMessage(msg)}
    if(isurl(msg.content)){DeviantArtEmbed(msg)}
}




function DotAnnoyMessage(msg){
    if(msg.author.bot) return;
      if(isurl(msg.content) || hasAttach(msg)) return;
      var contentstring =  msg.content.toLowerCase();

      var isquestion = false;
      QuestionSentenceList.forEach(element => {
        isquestion = isquestion || contentstring.startsWith(element)|| contentstring.endsWith(element);
      });
    
        switch(msg.content[msg.content.length -1]){
          case '.' : break;
          case '!' : break;
          case '?' : break;
          case ';' : break;
          case ':' : break;
          case ',' : break;
          default : if(isquestion){
            msg.reply(msg.content + '?');
          }else{
            msg.reply(msg.content + '.');
          } 
      }
}
async function DeviantArtEmbed(msg){
    if(msg.author.bot) return;
    if (!msg.content.includes("deviantart"))return;
    msg.suppressEmbeds(true);
    var starturl ;
    var urls = msg.content.split(" ");
    var uniques = urls.filter((x, i) => i === urls.indexOf(x))
    for (var url of uniques){
    if (!url.includes("deviantart"))continue;
    starturl = url.search("www");
    var fetchurl = url.slice(starturl);
    

    r = await fetch('https://backend.deviantart.com/oembed?url='+fetchurl,{method:'post'});
    r = await r.json();
    var messageEmbed  = new Discord.MessageEmbed()
        .setColor('#05cc46')
        .setTitle(r.title)
        .setURL('https://'+fetchurl)
        .setAuthor('DeviantArt','https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/479ab6ca-88d0-4518-b430-7609318768f8/d8ix39x-0aafc1ff-a9ec-40dd-acff-2117220ffc02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi80NzlhYjZjYS04OGQwLTQ1MTgtYjQzMC03NjA5MzE4NzY4ZjgvZDhpeDM5eC0wYWFmYzFmZi1hOWVjLTQwZGQtYWNmZi0yMTE3MjIwZmZjMDIucG5nIn1dXX0.GGM13RBPw_LyxNi1yOiV9JQyWAq5kyJTYq5s4UfIgqM','https://www.deviantart.com')
        .setThumbnail(await AuthorImg(r.author_name))
        .addField('Artist :',r.author_name)
        .setImage(r.url);
        msg.channel.send(messageEmbed);
    }
}

async function AuthorImg(author){
    author = author.toLowerCase()
    var first,second;
    first = author[0]; if(first == '-') first = '_';
    second = author[1]; if(second == '-') second = '_';

    var authorImage ='https://a.deviantart.net/avatars-big/'+first+'/'+second+'/'+r.author_name.toLowerCase();
    Imagecheck = await fetch(authorImage+'.png');
    if(Imagecheck.status != 200){
        Imagecheck = await fetch(authorImage+'.jpg');
        if(Imagecheck.status != 200){
        authorImage+='.gif' }else authorImage+='.jpg'
    }else{authorImage+='.png'}
    return authorImage;
}


function isurl(content){
    return (content.includes('http') || content.includes('www')) 
}
function hasAttach(msg){
    return msg.attachments.size != 0;
}