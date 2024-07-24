require('colors');
const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({intents: [Object.keys(Discord.GatewayIntentBits)]});

client.commands = new Discord.Collection();
client.login(config.token);


fs.readdir("./Commands/", (err, files) => {
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`) 
        client.commands.set(props.help.name, props);
    })
})




client.on("ready", () => {
    console.log(
        `Connected has ${client.user.tag}\n`.bgGreen.black +
        `Client Id: ${client.user.id}\n`.bgGreen.black +
        `Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8\n`.bgGreen.black +
        `Discord Version: ${Discord.version}`.bgGreen.black
    )

    client.user.setActivity(config.stream, {type: 1, url: "https://twitch.tv/002sans"});
})


client.on("messageCreate", async message => {
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");

    if (!message.content.startsWith(prefix)) return;
    
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if (commandFile && commandFile.wl && !message.member.roles.cache.get(config.wlrole)) return;
    if (commandFile && commandFile.helper && !message.member.roles.cache.get(config.helperRole)) return;
    if (commandFile) commandFile.run(client, message, args)                      
})