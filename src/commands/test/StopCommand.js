const BaseCommand = require('../../utils/structures/BaseCommand');
var mysql = require('mysql');

var con = mysql.createConnection("mysql://p25tggy3yuum47z4:qobzrmi5bj6u35ib@f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/orb72zev1k83i9im");

function GetFile(){
  return new Promise(function(resolve,reject){
  con.query("select filestring from commandsettings where id = 1", function(err,result){  
    if (err) {
      reject(err);
    }else{resolve(JSON.parse(result[0].filestring));}
  })
});
}

function SetFile(file){
  con.query("update commandsettings set filestring = '"+file+"' where id = 1",function(err,result){})
}

module.exports = class StopCommand extends BaseCommand {
  constructor() {
    super('stop', 'test', []);
  }
  
  async run(client, message, args) {
   
    var file = await GetFile();
    file.running = false;
    file.err = 0;
    SetFile(JSON.stringify(file));
    message.channel.send("L'activation journaliere de la commande à bien été desactivée");

  }
}