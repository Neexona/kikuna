const config = require('./config.json');
const {Client, RichEmbed} = require('discord.js');
const bot = new Client({disableEveryone: true});
const ms = require('ms');




bot.on('ready', async () => {
    console.log(`${bot.user.username} vient de se connecter !`);
    bot.user.setActivity('être une princesse !');
})

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    // Infos serveur
    if (command === `${prefix}servinfo`) {
        let servIcon = message.guild.iconURL;
        let ServEmbed = new RichEmbed()
        .setDescription('Voici la carte d\'identité du serveur')
        .setColor('#ae00ff')
        .setThumbnail(servIcon)
        .addField('Nom du serveur', message.guild.name)
        .addField('Nombre total de membres', message.guild.memberCount)
        .addField('Créer le : ', message.guild.createdAt)
        .addField('Vous avez rejoint le : ', message.member.joinedAt);

        return message.channel.send(ServEmbed);
    }

    // Infos bot
    if(command === `${prefix}botinfo`) {
        let botIcon = bot.user.displayAvatarURL;
        let embed = new RichEmbed()
            .setDescription('Voici ma carte d\'identité')
            .setColor('#ae00ff')
            .setThumbnail(botIcon)
            .addField('Mon nom', bot.user.username)
            .addField('Mon âge', "17 ans")
            .addField('Je suis née le : ', bot.user.createdAt)
            .addField('Fonctions : ', "Je suis le bot créer par Nuhranar dans le but de pouvoir l'aider.");
        return message.channel.send(embed);
    }

    // Report

    if (command === `${prefix}report`) {
        let reportedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!reportedUser) {
            return message.channel.send('L\'utilisateur n\'existe pas !');
        }
        let reportedReason = args.join(' ').slice(22);

        let reportEmbed = new RichEmbed()
            .setDescription("Report de joueur.")
            .setColor('#ae00ff')
            .addField('Joueur reporté :', `${reportedUser} (ID : ${reportedUser.id})`)
            .addField('Joueur ayant fait le report :', `${message.author} (ID : ${message.author.id})`)
            .addField('Channel', message.channel)
            .addField('Raison :', reportedReason);

        let reportChannel = message.guild.channels.find('name', 'reports');
        if (!reportChannel) {
            return message.channel.send("Channel 'Reports' introuvable, veuillez le créer s'il vous plaît.");
        };
        message.delete();
        reportChannel.send(reportEmbed);
    }

    // Kick

    if (command === `${prefix}kick`) {
        let kickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!kickedUser) {
            return message.channel.send('L\'utilisateur n\'existe pas !');
        }
        let kickedReason = args.join(' ').slice(22);
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.channel.send('Vous n\'avez pas les permissions pour faire cela.');
        }
        if (kickedUser.hasPermission('KICK_MEMBERS')) {
            return message.channel.send('Vous ne pouvez pas kick cette personne.');
        }

        let kickEmbed = new RichEmbed()
        .setDescription("Kick d'un joueur.")
        .setColor('#ae00ff')
        .addField('Joueur kické :', `${kickedUser} (ID : ${kickedUser.id})`)
        .addField('Joueur ayant kické :', `${message.author} (ID : ${message.author.id})`)
        .addField('Channel', message.channel)
        .addField('Raison :', kickedReason);

    let kickChannel = message.guild.channels.find('name', 'reports');
    if (!kickChannel) {
        return message.channel.send("Channel 'Reports' introuvable, veuillez le créer s'il vous plaît.");
    };
    message.guild.member(kickedUser).kick(kickedReason);
    kickChannel.send(kickEmbed);

    }

        // Ban

        if (command === `${prefix}ban`) {
            let bannedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!bannedUser) {
                return message.channel.send('L\'utilisateur n\'existe pas !');
            }
            let banReason = args.join(' ').slice(22);
            if (!message.member.hasPermission('BAN_MEMBERS')) {
                return message.channel.send('Vous n\'avez pas les permissions pour faire cela.');
            }
            if (bannedUser.hasPermission('BAN_MEMBERS')) {
                return message.channel.send('Vous ne pouvez pas kick cette personne.');
            }
    
            let banEmbed = new RichEmbed()
            .setDescription("Ban d'un joueur.")
            .setColor('#ae00ff')
            .addField('Joueur banni :', `${bannedUser} (ID : ${bannedUser.id})`)
            .addField('Joueur ayant banni :', `${message.author} (ID : ${message.author.id})`)
            .addField('Channel', message.channel)
            .addField('Raison :', banReason);
    
        let banChannel = message.guild.channels.find('name', 'reports');
        if (!banChannel) {
            return message.channel.send("Channel 'Reports' introuvable, veuillez le créer s'il vous plaît.");
        };
        message.guild.member(bannedUser).ban(banReason);
        banChannel.send(banEmbed);
    
        }

        // Mute

        if (command === `${prefix}mute`) {
            let muteUser = message.guild.member(
                message.mentions.users.first() || message.guild.members.get(args[0])
              );
              if (!muteUser) return message.channel.send("L'utilisateur n'existe pas !");
            
              if (!message.member.hasPermission("MANAGE_MESSAGES"))
                return message.channel.send("Vous n'avez pas les permissions.");
            
              if (muteUser.hasPermission("MANAGE_MESSAGES"))
                return message.channel.send("Vous ne pouvez pas mute cette personne.");
            
              let muteRole = message.guild.roles.find(`name`, 'muted');
            
              if (!muteRole) {
                try {
                  muteRole = await message.guild.createRole({
                    name: "muted",
                    color: "#000",
                    permissions: []
                  });
                  message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muteRole, {
                      SEND_MESSAGES: false,
                      ADD_REACTIONS: false
                    });
                  });
                } catch (e) {
                  console.log(e.stack)
                }
              }
            
              let muteTime = args[1];
              if (!muteTime) return message.channel.send("Spécifier un durée");
            
              await muteUser.addRole(muteRole.id);
              message.channel.send(`<@${muteUser.id}> est muté pour ${ms(ms(muteTime))}.`);
            
              setTimeout(() => {
                muteUser.removeRole(muteRole.id);
                message.channel.send(`<@${muteUser.id}> n'est plus muté.`);
              }, ms(muteTime))
            };

        // Say

        if (command === `${prefix}say`) {
          let messageToBot = args.join(' ');
          message.delete().catch();
          message.channel.send(messageToBot);
        };
   
})

bot.login(config.token);