const Discord = require("discord.js");
const config = require("../config.json")
const fs = require('fs')

module.exports.run = async (client, message, args) => {

    const embed_wl_error = new Discord.EmbedBuilder()
        .setDescription(`**${config.m_wl_error}**`)
        .setColor(config.embedColor)

    const embed_wl_null = new Discord.EmbedBuilder()
        .setDescription(config.m_wl_null)
        .setColor(config.embedColor)

    if (!message.member.roles.cache.get(config.helperRole)) return;

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) //|| await message.guild.members.fetch(args[0]).catch(() => false)
    if (!target) return message.channel.send({embeds: [embed_wl_error]});

    const embed_wl_succes = new Discord.EmbedBuilder()
        .setDescription(`**✅ ${target.user.username} ${config.m_wl_sucess}**`)
        .setColor(config.embedColor)

    const embed1 = new Discord.EmbedBuilder() 
        .setTitle(`**Bievenue dans votre salon privé, ${target.user.username}**`)
        .setDescription(`Vous disposez maintenant de votre propre salon privé pour faire des publicités avec ${client.user.username} !\nRappelez-vous que vous devez avoir un ou plusieurs tokens de bot pour utiliser ${client.user.username}, si vous n'avez pas encore de token, adressez-vous à un helper pour en savoir plus.`)
        .setColor(config.embedColor)

        var embed2 = new Discord.EmbedBuilder()
        .setTitle(`**__Voici les commandes du bot ${client.user.username} (${client.commands.size} Cmds) :__**`)
        .setThumbnail("https://images-ext-2.discordapp.net/external/kqVPuhjXMwBLCRx8TPqoK9jarONo_qCKyGaH4ezFNQs/https/cdn.discordapp.com/icons/1170776059126501458/b84b58dfccfc47dd04b336abbcee2d80.webp?format=webp")
        .setDescription("`token_bot` doit être remplacé par le token de votre bot !")
        .setColor(config.embedColor)
        if (config.helpimg) embed2.setImage(config.helpimg)

      const commandFiles = fs.readdirSync(`./Commands/`).filter(file => file.endsWith('.js'));
  
      for (const file of commandFiles) {
        const command = require(`./${file}`);
        
        if (command.help.hide || command.help.category !== "help") continue;
        embed2.addFields({name: `**${config.prefix}\`${command.help.name}${command.help.token ? ` token_bot` : ""}\`**`, value: `${config.emoji ?? ""} ${command.help.description ?? "Aucune description"}`})
      }
    const channel = await message.guild.channels.create({
        name: target.user.username,
        type: 0,
        topic: `whitelist: ${target.user.id}`,
        permissionOverwrites: [
            {
                id: message.guild.id,
                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: target.user.id,
                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
            }
        ]
    })

    if (config.category){
        const category = message.guild.channels.cache.find(c => c.type === 4 && c.id === config.category);
        if (category) channel.setParent(category)
    }

    await target.roles.add(config.wlrole).catch(() => false);
    await channel.send({embeds: [embed1, embed2], content: `${target}`});
    await message.channel.send({embeds: [embed_wl_succes]});
}

module.exports.help = {
    name: "wl",
    hide: true,
    helper: true,
}