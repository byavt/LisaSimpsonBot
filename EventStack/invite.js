const { Client, EmbedBuilder } = require("discord.js");
const client = require("../Structures/index");
const invites = new Map();
const LogsDB = require("../Structures/Database/Schemas/Modlogs");
const wait = require("timers/promises").setTimeout;
const { Discord } = require("discord-id");
const djsClient = new Discord(process.env.DISCORD_TOKEN);

client.on("ready", async () => {
    await wait(4000);

    client.guilds.cache.forEach(async guild => {
        const firstInvites = guild.invites.fetch();

        try {
            invites.set(guild.id, new Map((await firstInvites).map(invite => [invite.code, invite.uses])));
        } catch (error) {
            return;
        };
    });
});

client.on("inviteDelete", async invite => {
    invites.get(invite.guild.id).delete(invite.code)
});

client.on("inviteCreate", async invite => {
    invites.get(invite.guild.id).set(invite.code);
});

client.on("guildCreate", async guild => {
    guild.invites.fetch().then(guildInvites => {
        invites.set(guild.id, new Map(guildInvites.map(invite => [invite.code, invite.uses])))
    }).catch(err => {
        if (err.code !== 50013) return console.error(err);
    });
});

client.on("guildDelete", async guild => {
    invites.delete(guild.id);
});

client.on("guildMemberAdd", async member => {
    const { guild, user } = member;

    guild.invites.fetch().then(async newInvites => {
        const oldInvites = invites.get(guild.id);
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

        const Data = await LogsDB.findOne({ Guild: guild.id });
        if (!Data) return;

        const Channel = client.channels.cache.get(Data.Channel);
        if (!Channel) return;

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setTitle("Un usuario fue invitado")
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        if (!invite) return Channel.send({
            embeds: [
                Embed.setDescription(`El usuario ${user} se unió, no pude encontrar a través de qué invitación, no pude obtener al usuario que lo invitó.`)
            ]
        });

        djsClient.grabProfile(invite.inviter.id).then(async inviter => {
            const Inviter = inviter.username + "#" + inviter.discriminator;

            return Channel.send({ embeds: [Embed.setDescription(`El usuario **${user.tag}** se ha unido usando el codigo de invitacion \`${invite.code}\` de **${Inviter}**. El codigo se ha utilizado un total de \`${invite.uses}\` vezes!`)] })
        });
    }).catch(err => {
        if (err.code !== 50013) return console.error(err);
    });
});