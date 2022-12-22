const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField,
    AuditLogEvent,
    Role,
} = require("discord.js");
const LogsDB = require("../Structures/Database/Schemas/Logs");
const client = require("../Structures/index");
const { generateFromMessages } = require("discord-html-transcripts");
const ms = require("ms");
const MinimmumTime = ms("365d");

client.on("guildMemberAdd", async (member) => {
    const Data = await LogsDB.findOne({ Guild: member.guild.id });
    if (!Data) return;

    const Channel = member.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const CreatedAt = new Date(member.user.createdAt).getTime();
    const Difference = Date.now() - CreatedAt;

    if (Difference < MinimmumTime) {
        const Embed = new EmbedBuilder().setColor("Red");
        const Row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("alt_ban")
                .setLabel("Banear")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("alt_kick")
                .setLabel("Expulsar")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("alt_warn")
                .setLabel("Avisar")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("alt_let")
                .setLabel("No Castigar")
                .setStyle(ButtonStyle.Success)
        );

        await Channel.send({
            embeds: [
                Embed.setAuthor({
                    name: `${member.user.username}`,
                    iconURL: member.user.displayAvatarURL(),
                })
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTitle(`${process.env.Warn} Advertencia de Multi Cuenta`)
                    .setDescription(
                        `He detectado una **Multi Cuenta**, dale a los botones para decidir la accion final.`
                    )
                    .setFields([
                        {
                            name: "Cuentra Creada El:",
                            value: `<t:${parseInt(CreatedAt / 1000)}:d>`,
                            inline: true,
                        },
                        { name: "Accion Tomada:", value: `\`No tomada\``, inline: true },
                    ])
                    .setFooter({ text: `${member.user.id}` }),
            ],
            components: [Row],
        });
    }
});

client.on("channelCreate", async (channel) => {
    const Data = await LogsDB.findOne({ Guild: channel.guild.id });
    if (!Data) return;

    const Channel = channel.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    let channelType;
    let category;

    if (channel.type === ChannelType.GuildText) channelType = "Canal de Texto";
    if (channel.type === ChannelType.GuildVoice) channelType = "Canal de Voz";
    if (channel.type === ChannelType.GuildAnnouncement)
        channelType = "Canal de Anuncios";
    if (channel.type === ChannelType.GuildStageVoice)
        channelType = "Canal de Eventos";
    if (channel.type === ChannelType.GuildCategory)
        channelType = "Canal de Categoria";

    if (channel.parent) category = channel.parent.name;
    else if (!channel.parent) category = "Sin categoria";

    const ChannelInfo = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(channel.guild.iconURL())
        .setTitle(`⚠️ ${channelType} creado`)
        .setDescription("Un canal ha sido Creado.")
        .setFields([
            { name: "Nombre", value: `\`${channel.name}\``, inline: true },
            { name: "ID", value: `\`${channel.id}\``, inline: true },
            { name: "Categoria", value: `\`${category}\``, inline: true },
            //{ name: "Tipo", value: `**${channel.type}**`, inline: true }
        ])
        .setTimestamp();

    Channel.send({
        embeds: [ChannelInfo],
    });
});

client.on("channelDelete", async (channel) => {
    const Data = await LogsDB.findOne({ Guild: channel.guild.id });
    if (!Data) return;

    const Channel = channel.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    let channelType;
    let category;

    if (channel.type === ChannelType.GuildText) 
        channelType = "Canal de Texto";
    if (channel.type === ChannelType.GuildVoice) 
        channelType = "Canal de Voz";
    if (channel.type === ChannelType.GuildAnnouncement)
        channelType = "Canal de Anuncios";
    if (channel.type === ChannelType.GuildStageVoice)
        channelType = "Canal de Eventos";
    if (channel.type === ChannelType.GuildCategory)
        channelType = "Canal de Categoria";

    if (channel.parent) category = channel.parent.name;
    else if (!channel.parent) category = "Sin categoria";

    const ChannelInfo = new EmbedBuilder()
        .setColor("Blue")
        .setThumbnail(channel.guild.iconURL())
        .setTitle(`⚠️ ${channelType} borrado`)
        .setDescription("Un canal ha sido **Borrado.**")
        .setFields([
            { name: "Nombre:", value: `\`${channel.name}\``, inline: true },
            { name: "ID:", value: `\`${channel.id}\``, inline: true },
            { name: "Categoria:", value: `\`${category}\``, inline: true },
        ])
        .setTimestamp();

    Channel.send({
        embeds: [ChannelInfo],
    });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    const Data = await LogsDB.findOne({ Guild: newChannel.guild.id });
    if (!Data) return;

    const Channel = newChannel.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    if (newChannel.name !== oldChannel.name) {
        const ChannelInfo = new EmbedBuilder()
            .setColor("Green")
            .setThumbnail(newChannel.guild.iconURL())
            .setTitle(`⚠️ Canal Actualizado`)
            .setDescription("El nombre de un Canal ha sido **Actualizado.**")
            .setFields([
                {
                    name: "Nuevo Nombre:",
                    value: `\`${newChannel.name}\``,
                    inline: true,
                },
                {
                    name: "Antiguo Nombre:",
                    value: `\`${oldChannel.name}\``,
                    inline: true,
                },
            ])
            .setTimestamp();

        await Channel.send({
            embeds: [ChannelInfo],
        });
    } else if (newChannel.parent.name !== oldChannel.parent.name) {
        const ChannelInfo = new EmbedBuilder()
            .setColor("Green")
            .setThumbnail(newChannel.guild.iconURL())
            .setTitle(`⚠️ Canal Actualizado`)
            .setDescription("La categoria de un Canal a sido **Actualizada.**")
            .setFields([
                {
                    name: "Nueva Categoria:",
                    value: `\`${newChannel.parent ? newChannel.parent.name : "Sin nueva categoria"
                        }\``,
                    inline: true,
                },
                {
                    name: "Antigua Categoria:",
                    value: `\`${oldChannel.parent ? oldChannel.parent.name : "Sin antigua categoria"
                        }\``,
                    inline: true,
                },
            ])
            .setTimestamp();

        await Channel.send({
            embeds: [ChannelInfo],
        });
    } else if (newChannel.type !== oldChannel.type) {
        let oldChannelType;
        let newChannelType;

        if (oldChannel.type === ChannelType.GuildText)
            oldChannelType = "Canal de Texto";
        if (oldChannel.type === ChannelType.GuildVoice)
            oldChannelType = "Canal de Voz";
        if (oldChannel.type === ChannelType.GuildAnnouncement)
            oldChannelType = "Canal de Anuncios";
        if (oldChannel.type === ChannelType.GuildStageVoice)
            oldChannelType = "Canal de Eventos";
        if (oldChannel.type === ChannelType.GuildCategory)
            oldChannelType = "Canal de Categoria";

        if (newChannel.type === ChannelType.GuildText)
            newChannelType = "Canal de Texto";
        if (newChannel.type === ChannelType.GuildVoice)
            newChannelType = "Canal de Voz";
        if (newChannel.type === ChannelType.GuildAnnouncement)
            newChannelType = "Canal de Anuncios";
        if (newChannel.type === ChannelType.GuildStageVoice)
            newChannelType = "Canal de Eventos";
        if (newChannel.type === ChannelType.GuildCategory)
            newChannelType = "Canal de Categoria";

        const ChannelInfo = new EmbedBuilder()
            .setColor("Green")
            .setThumbnail(newChannel.guild.iconURL())
            .setTitle(`⚠️ Canal Actualizado`)
            .setDescription("El tipo de Canal ha sido **Cambiado**.")
            .setFields([
                { name: "Nuevo Tipo:", value: `\`${newChannelType}\``, inline: true },
                { name: "Antiguo Tipo:", value: `\`${oldChannelType}\``, inline: true },
            ])
            .setTimestamp();

        await Channel.send({
            embeds: [ChannelInfo],
        });
    }
});

client.on("messageDelete", async (message) => {
    const Data = await LogsDB.findOne({ Guild: message.guild.id });
    if (!Data) return;

    const Channel = message.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete
    });

    const MessageInfo = new EmbedBuilder()
        .setColor("Red")
        .setThumbnail(message.guild.iconURL())
        .setTitle("🗑️ Mensaje Borrado")
        .setDescription("Un mensaje ha sido **Borrado**.")
        .setFields([
            { name: "Mensaje:", value: `${message.content}`, inline: true },
            { name: "Canal:", value: `${message.channel.name}`, inline: true },
            {
                name: "Autor:",
                value: `${message.author ? message.author.username : "Nadie"}`,
                inline: true,
            },
        ])
        .setTimestamp();

    Channel.send({
        embeds: [MessageInfo],
    });
});

client.on("messageDeleteBulk", async (messages, channel) => {
    const Data = await LogsDB.findOne({ Guild: channel.guild.id });
    if (!Data) return;

    const Channel = channel.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await messages.first().guild.fetchAuditLogs({
        limit: 1,
    });
    const Log = Logs.entries.first();

    const Numb = messages.size;
    const Message = messages.map((m) => m);
    const DeletedChannel = messages.first().channel;
    const ID = Math.floor(Math.random() * 5485444) + 4000000;

    const MessageInfo = new EmbedBuilder().setColor("Red");

    try {
        const Attachment = await generateFromMessages(Message, DeletedChannel, {
            returnBuffer: false,
            filename: `transcript-${ID}.html`,
        });

        Channel.send({
            embeds: [
                MessageInfo.setThumbnail()
                    .setTitle("🗑️ Multiples mensajes Eliminados")
                    .setDescription(`\`${Numb}\` mensaje(s) han sido **Eliminados**.`)
                    .setFields([
                        { name: "Canal:", value: `${DeletedChannel}`, inline: true },
                        { name: "Ejecutor:", value: `${Log.executor}`, inline: true },
                    ])
                    .setTimestamp()
                    .setFooter({ text: messages.first().guild.name }),
            ],
            files: [Attachment],
        });
    } catch (error) {
        console.log(error.stack);
    }
});

client.on("roleCreate", async (role) => {
    const Data = await LogsDB.findOne({ Guild: role.guild.id });
    if (!Data) return;

    const Channel = role.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleCreate,
    });
    const Log = Logs.entries.first();

    const RoleInfo = new EmbedBuilder()
        .setColor("Green")
        .setThumbnail(role.guild.iconURL())
        .setTitle("⚠️ Rol Creado")
        .setFooter({ text: `Creado por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() })
        .setTimestamp();

    if (Log) {
        RoleInfo
            .setDescription("Un rol ha sido **Creado**.")
            .setFields([
                { name: "Color:", value: `\`${role.color}\``, inline: true },
                { name: "Mencionable:", value: `\`${role.mentionable ? "`Si`" : "`No`"}\``, inline: true },
                { name: "Posición:", value: `\`${role.position - 1}\``, inline: true}
            ]);

        if (role.permissions.bitfield) {
            const P = 
                new PermissionsBitField(role.permissions.bitfield)
                    .toArray()
                    .slice(" ")
                    .map((e) => `\`${e}\``)
                    .join(" ")
                    .toLowerCase()
                    .replaceAll("_", "") || "Ningun permiso";
                
            RoleInfo.addFields([
                { name: "Permisos:", value: `${P}`, inline: true }
            ]);
        }

        Channel.send({
            embeds: [RoleInfo]
        });
    }
});

client.on("roleDelete", async (role) => {
    const Data = await LogsDB.findOne({ Guild: role.guild.id });
    if (!Data) return;

    const Channel = role.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete,
    });
    const Log = Logs.entries.first();

    const RoleInfo = new EmbedBuilder()
        .setColor("Red")
        .setThumbnail(role.guild.iconURL())
        .setTitle("🗑️ Rol Eliminado")
        .setFooter({ text: `Eliminado por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() })
        .setTimestamp();
    if (Log) {
        RoleInfo
            .setDescription("Un rol ha sido **Actualizado**.")
            .setFields([
                { name: "Nombre:", value: `\`${role.name}\``, inline: true },
                { name: "Ejectuor:", value: `${Log.executor}`, inline: true },
            ]);

        Channel.send({
            embeds: [RoleInfo]
        });
    }
});

client.on("roleUpdate", async (oldRole, newRole) => {
    const Data = await LogsDB.findOne({ Guild: newRole.guild.id });
    if (!Data) return;

    const Channel = newRole.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await newRole.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
    });
    const Log = Logs.entries.first();

    const RoleInfo = new EmbedBuilder()
        .setColor("Orange")
        .setThumbnail(newRole.guild.iconURL())
        .setTitle("🗑️ Rol Actualizado")
        .setFooter({ text: `Actualizado por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() })
        .setTimestamp();

    if (Log) {
        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            const oldP = 
                new PermissionsBitField(oldRole.permissions.bitfield)
                    .toArray()
                    .slice(" ")
                    .map((e) => `\`${e}\``)
                    .join(" ")
                    .toLowerCase();

            const newP = 
                new PermissionsBitField(newRole.permissions.bitfield)
                    .toArray()
                    .slice(" ")
                    .map((e) => `\`${e}\``)
                    .join(" ")
                    .toLowerCase();
                
            RoleInfo
                .setDescription(`Los permisos del rol \`${newRole.name}\` han sido **Actualizados**.`)
                .addFields([
                    { name: "Antiguos Permisos:", value: `${oldP}`, inline: true },
                    { name: "Nuevos Permisos:", value: `${newP}`, inline: true }
                ]);

            Channel.send({
                embeds: [RoleInfo]
            });
        } else if (oldRole.name !== newRole.name) {
            RoleInfo
                .setDescription(`El nombre del rol \`${oldRole.name}\` ha sido **Actualizado**.`)
                .addFields([
                    { name: "Antiguos Nombre:", value: `\`${oldRole.name}\``, inline: true },
                    { name: "Nuevo Nombre:", value: `\`${newRole.name}\``, inline: true }
                ]);

            Channel.send({
                embeds: [RoleInfo]
            });
        } else if (oldRole.color !== newRole.color) {
            RoleInfo
                .setDescription(`El color del rol \`${newRole.name}\` ha sido **Actualizado**.`)
                .addFields([
                    { name: "Antiguo Color:", value: `\`${oldRole.color}\``, inline: true },
                    { name: "Nuevo Color:", value: `\`${newRole.color}\``, inline: true }
                ]);

            Channel.send({
                embeds: [RoleInfo]
            });
        } else if (oldRole.icon !== newRole.icon) {
            RoleInfo
                .setDescription(`El icono del rol \`${newRole.name}\` ha sido **Actualizado**.`)
                .setImage(newRole.iconURL())
                .setFields([
                    { name: "Antiguo Icono", value: oldRole.icon ? `${oldRole.iconURL()}` : "No habia ningun icono anterior." },
                    { name: "Nuevo Icono", value: newRole.icon ? `${newRole.iconURL()}` : "No hay ningun icono nuevo." }
                ]);
        
            Channel.send({
                embeds: [RoleInfo]
            });
        } else if (!oldRole.mentionable && newRole.mentionable) {
            RoleInfo
                .setDescription(`El rol \`${newRole.name}\` es ahora **Mencionable!**`)
        
            Channel.send({
                embeds: [RoleInfo]
            });
        } else if (oldRole.mentionable && !newRole.mentionable) {
            RoleInfo
                .setDescription(`El rol \`${newRole.name}\` ya no es **Mencionable!**`)
        
            Channel.send({
                embeds: [RoleInfo]
            });
        }
    }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const Data = await LogsDB.findOne({ Guild: newMember.guild.id });
    if (!Data) return;

    const Channel = newMember.guild.channels.cache.get(Data.Channel);
    if (!Channel) return;

    const Logs = await newMember.guild.fetchAuditLogs({
        limit: 1,
    });
    const Log = Logs.entries.first();

    const MemberInfo = new EmbedBuilder()
        .setThumbnail(newMember.guild.iconURL())
        .setTimestamp();

    if (Log.action == AuditLogEvent.MemberRoleUpdate) {
        if (oldMember.roles.cache.size == newMember.roles.cache.size) return;

        MemberInfo
            .setColor("Red")
            .setTitle("⚠️ 1 o Varios roles Añadidos/Removidos")
            .setDescription(`1 o Varios roles han sido Añadidos/Removidos de ${oldMember}`)
            .setFooter({ text: `Añadidos/Removidos por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() });

        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            const P = Log.changes
                .find((x) => x.key == "$remove")
                .new.map((e) => `<@&${e.id}>`)
                .join(" ");

            MemberInfo.addFields([ { name: "Rol(es) Removido(s) 📛:", value: `${P}`, inline: true }, { name: "Ejectuor", value: `${Log.executor}`, inline: true } ]);
        } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const P = Log.changes
				.find((x) => x.key == "$add")
				.new.map((e) => `<@&${e.id}>`)
				.join(" ");
            
            MemberInfo.addFields([ { name: "Rol(es) Añadido(s) ✅:", value: `${P}`, inline: true }, { name: "Ejectuor", value: `${Log.executor}`, inline: true } ]);
        }

        Channel.send({
            embeds: [MemberInfo]
        });
    } else if (Log.action == AuditLogEvent.MemberUpdate) {
        MemberInfo
            .setColor("Red")
            .setThumbnail(newMember.displayAvatarURL())
            .setTitle("⚠️ Miembro Actualizado")

        if (oldMember.nickname !== newMember.nickname) {
            MemberInfo
                .setColor("Blue")
                .setDescription(`El apodo de ${oldMember} ha sido **Actualizado**.`)
                .addFields([
                    { name: "Antiguo Apodo:", value: `${oldMember.nickname ? `\`${oldMember.nickname}\`` : "No tenia ningun apodo anterior."}`, inline: true },
                    { name: "Nuevo Apodo:", value: `${newMember.nickname ? `\`${newMember.nickname}\`` : "No tiene nuevo apodo."}`, inline: true }
                ])
                .setFooter({ text: `Actualizado por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() });

            Channel.send({
                embeds: [MemberInfo]
            });
        } else if (!oldMember.premiumSince && newMember.premiumSince) {
            MemberInfo
                .setColor("Green")
                .setDescription(`${oldMember} acaba de **Boostear** el servidor!`)
                .setFooter({ text: newMember.guild.name });

            Channel.send({
                embeds: [MemberInfo]
            });
        } else if (oldMember.avatar !== newMember.avatar) {
            MemberInfo
                .setTitle("⚠️ Miembro Actualizado")
                .setDescription(`El avatar del servidor de ${oldMember} ha sido **Actualizado**.`)
                .setImage(newMember.displayAvatarURL())
                .addFields([
                    { name: "Antiguo Avatar", value: `${oldMember.avatar ? `${oldMember.avatarURL({ dynamic: true })}` : "No tenia ningun avatar anterior."}`, inline: false },
                    { name: "Nuevo Avatar", value: `${newMember.avatar ? `${newMember.avatarURL({ dynamic: true })}` : "No tiene nuevo avatar"}`, inline: false }
                ])
                .setFooter({ text: `Actualizado por: ${Log.executor.username}`, iconURL: Log.executor.displayAvatarURL() });

            Channel.send({ 
                embeds: [MemberInfo] 
            });
        }
    }
});