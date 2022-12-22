const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");
const Links = [
    "https://media.tenor.com/wMHJk-5S334AAAAC/explosion.gif",
    "https://i.pinimg.com/originals/c6/a8/a7/c6a8a77e12a1b8e777ebadf9337c771f.gif",
    "https://media.tenor.com/VhwVXvHNd_MAAAAd/nuclear-nuclearbomb.gif",
    "https://i.pinimg.com/originals/e2/75/78/e275783c9a40b4551481a75a542cdc79.gif",
    "https://bestanimations.com/media/nuclear-explosions/1786720729atomic-mushroom-cloud-nuclear-explosion-4-3.gif",
    "https://bestanimations.com/media/nuclear-explosions/726046542nuclear-atom-bomg-explosion-animated-gif-4.gif",
    "https://i.gifer.com/7SN.gif",
    "https://i.gifer.com/origin/ce/ce2e8b0406dc341096df5736c6af87a2.gif",
    "https://media.tenor.com/yZ3SgR_2mX0AAAAd/boom-explosion.gif",
    "https://media.tenor.com/2ASEP-BmFh0AAAAC/boom-world-explodes.gif"
]
const RandomGif = Links[Math.floor(Math.random() * Links.length)];

module.exports = {
    name: "moderación",
    description: "Modera el servidor.",
    UserPerms: ["ModerateMembers"],
    Category: "Moderation",
    options: [
        {
            name: "warn",
            description: "Avisa a un usuario del servidor.",
            type: 2,
            options: [
                {
                    name: "añadir",
                    description: "Añade un aviso a un usuario.",
                    type: 1,
                },
            ],
        },
        {
            name: "ban",
            description: "Banea permanentemente a un miembro del servidor.",
            type: 1,
            options: [
                {
                    name: "usuario",
                    description: "Seleccione el usuario a ser baneado",
                    type: 6,
                    required: true,
                },
                {
                    name: "razon",
                    description: "Indique el motivo del baneo.",
                    type: 3,
                    required: false,
                },
            ],
        },
        {
            name: "kick",
            description: "Expulsa a un miembro del servidor.",
            type: 1,
            options: [
                {
                    name: "usuario",
                    description: "Seleccione el usuario a ser expulsado.",
                    type: 6,
                    required: true,
                },
                {
                    name: "razon",
                    description: "Indique el motivo de la patada.",
                    type: 3,
                    required: false,
                },
            ],
        },
        {
            name: "clear",
            description: "Elimina una cantidad de mensajes.",
            type: 1,
            options: [
                {
                    name: "cantidad",
                    description: "La cantidad de mensajes a eliminar.",
                    type: 10,
                    required: true,
                },
                {
                    name: "usuario",
                    description: "Elimina los mensajes de un usuario en concreto.",
                    type: 6,
                    required: false,
                }
            ],
        },
        {
            name: "nuke",
            description: "Elimina y clona el canal donde se ejecuta el comando.",
            type: 1,
        }
    ],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { channel, guild, options, user, member } = interaction;

        const Sub = options.getSubcommand(false);

        switch (Sub) {
            case "ban": {
                const member = options.getMember("usuario");
                const reason =
                    options.getString("razon") || "No se ha especificado ninguna razon!";

                if (member.id === user.id)
                    return EditReply(
                        interaction,
                        process.env.Cross,
                        `¡No puedes banear a ti mismo!`
                    );
                if (guild.ownerId === member.id)
                    return EditReply(
                        interaction,
                        process.env.Cross,
                        `¡No puedes banear al dueño del servidor!`
                    );

                if (
                    guild.members.me.roles.highest.position <=
                    member.roles.highest.position
                )
                    return EditReply(
                        interaction,
                        process.env.Cross,
                        `¡No puedes banear a un miembro de tu mismo nivel o superior!`
                    );

                if (
                    interaction.member.roles.highest.position <=
                    member.roles.highest.position
                )
                    return EditReply(
                        interaction,
                        process.env.Cross,
                        `No puedo ejecutar este comando, muévame más alto que los otros miembros en \`ROLES\`!`
                    );

                const Embed = new EmbedBuilder().setColor(client.color);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("ban-yes")
                        .setLabel("Confirmar"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("ban-no")
                        .setLabel("Cancelar")
                );

                const Page = await interaction.editReply({
                    embeds: [
                        Embed.setDescription(
                            `**${process.env.Warn} | ¿De verdad quieres banear a este miembro?**`
                        ),
                    ],
                    components: [row],
                });

                const col = await Page.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: ms("15s"),
                });

                col.on("collect", (i) => {
                    if (i.user.id !== user.id) return;

                    switch (i.customId) {
                        case "ban-yes":
                            {
                                member.ban({
                                    reason,
                                });

                                interaction.editReply({
                                    embeds: [
                                        Embed.setDescription(
                                            `${process.env.Warn} | ${member} ha sido baneado por: **${reason}**`
                                        ),
                                    ],
                                    components: [],
                                });

                                console.log(
                                    `${user.tag} (${user.id}) ha baneado a ${member.user.tag} (${member.user.id}) desde ${guild.name} (${guild.id})`
                                );

                                member
                                    .send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setTitle(`${process.env.Warn} | Has sido Baneado!`)
                                                .setColor(client.color)
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .addFields(
                                                    {
                                                        name: "Nombre:",
                                                        value: `${member.user.tag}`,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: "Baneado por:",
                                                        value: `${user.tag}`,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: "Baneado en:",
                                                        value: `${guild.name}`,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: "Razon",
                                                        value: `${reason}`,
                                                    }
                                                )
                                                .setTimestamp(),
                                        ],
                                    })
                                    .catch((err) => {
                                        if (err.code !== 50007) return console.log(err);
                                    });

                                client.modLogs(guild, user, member, reason, "ban");
                            }
                            break;

                        case "ban-no":
                            {
                                interaction.editReply({
                                    embeds: [
                                        Embed.setDescription(
                                            `${process.env.Succes} | Solicitud de baneo cancelada!`
                                        ),
                                    ],
                                    components: [],
                                });
                            }
                            break;
                    }
                });

                col.on("end", (collected) => {
                    if (collected.size > 0) return;

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(
                                `${process.env.Cross} | ¡No diste una respuesta a tiempo!`
                            ),
                        ],
                        components: [],
                    });
                });
            }
                break;
            case "kick":
                {
                    const {
                        options,
                        user,
                        guild
                    } = interaction;
            
                    const member = options.getMember("usuario");
                    const reason = options.getString("razon") || "ninguna razón proporcionada";
            
                    if (member.id === user.id)
                        return EditReply(interaction, process.env.Cross, `¡No puedes patearte a ti mismo!`);
                    if (guild.ownerId === member.id)
                        return EditReply(interaction, process.env.Cross, `¡No puedes patear al dueño del servidor!`);
            
                    if (
                        guild.members.me.roles.highest.position <= member.roles.highest.position
                    )
                        return EditReply(
                            interaction,
                            process.env.Cross,
                            `¡No puedes expulsar a un miembro de tu mismo nivel o superior!`
                        );
            
                    if (
                        interaction.member.roles.highest.position <= member.roles.highest.position
                    )
                        return EditReply(
                            interaction,
                            process.env.Cross,
                            `¡No puedo ejecutar este comando, por favor muévame más alto que los otros miembros en \`ROLES\`!`
                        );
            
                    const Embed = new EmbedBuilder().setColor(client.color);
            
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("kick-yes")
                            .setLabel("Yes"),
            
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("kick-no")
                            .setLabel("No")
                    );
            
                    const Page = await interaction.editReply({
                        embeds: [
                            Embed.setDescription(
                                `**${process.env.Warn} | Seguro que quieres banear al usuario?**`
                            ),
                        ],
                        components: [row],
                    });
            
                    const col = await Page.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: ms("15s"),
                    });
            
                    col.on("collect", (i) => {
                        if (i.user.id !== user.id) return;
            
                        switch (i.customId) {
                            case "kick-yes": {
                                member.kick({
                                    reason,
                                });
            
                                interaction.editReply({
                                    embeds: [
                                        Embed.setDescription(
                                            `${process.env.Succes} | ${member} Ha sido expulsado por: **${reason}**`
                                        ),
                                    ],
                                    components: [],
                                });
            
                                console.log(
                                    `${user.tag} (${user.id}) ha expulsado a ${member.user.tag} (${member.user.id}) de ${guild.name} (${guild.id})`
                                );
            
                                member
                                    .send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setTitle(`${process.env.Warn} | Has sido Expulsado!`)
                                                .setColor(client.color)
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .addFields({
                                                    name: "Nombre:",
                                                    value: `${member.user.tag}`,
                                                    inline: true,
                                                }, {
                                                    name: "Expulsado por:",
                                                    value: `${user.tag}`,
                                                    inline: true,
                                                }, {
                                                    name: "Expulsado de:",
                                                    value: `${guild.name}`,
                                                    inline: true,
                                                })
                                                .addField("Razon:", `${reason}`)
                                                .setTimestamp()
                                        ],
                                    })
                                    .catch((err) => {
                                        if (err.code !== 50007) return console.log(err);
                                    });
                            }
                                break;
            
                            case "kick-no": {
                                interaction.editReply({
                                    embeds: [Embed.setDescription(`${process.env.Succes} | Solicitud de patada cancelada.`)],
                                    components: [],
                                });
                            }
                                break;
                        }
                    });
            
                    col.on("end", (collected) => {
                        if (collected.size > 0) return;
            
                        interaction.editReply({
                            embeds: [
                                Embed.setDescription(`${process.env.Cross} | ¡No diste una respuesta a tiempo!`),
                            ],
                            components: [],
                        });
                    });
                }
                break;
            case "nuke":
                {
                    const Embed = new EmbedBuilder()
                        .setColor("Red");

                    const Row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("nuke-confirm")
                                .setLabel("Si")
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId("nuke-decline")
                                .setLabel("No")
                                .setStyle(ButtonStyle.Success),
                        );

                    const Message = await interaction.editReply({
                        embeds: [Embed.setDescription(`${process.env.Warn} | Estas seguro que quieres nukear este canal?`)],
                        components: [Row]
                    });

                    const Page = Message.createMessageComponentCollector({
                        filter: i => user.id === i.user.id,
                        max: 1,
                        time: 20000
                    });

                    Page.on("collect", async i => {
                        if (i?.customId === "nuke-confirm") {
                            interaction.editReply({
                                embeds: [Embed.setDescription(`<a:loading_blue:1011951095435759627> | Proceso en curso...`)],
                                components: []
                            });

                            await channel.clone()
                                .then(async (ch) => {
                                    await channel.delete();

                                    client.modLogs(guild, user, channel, null, "nuke");

                                    return ch.send({
                                        embeds: [Embed.setTitle("El canal ha sido Nukeado!").setDescription(`El canal **${channel.name}** ha sido destruido por ${user}`).setImage(RandomGif)]
                                    });
                                });
                        }
                    });
                }
                break;
            case "clear":
                {
                    const Target = options.getUser("usuario");
                    const Amount = options.getNumber("cantidad");

                    if (Amount > 100)
                        return EditReply(interaction, process.env.Cross, "La cantidad **no puede ser** mas de 100!", client.color);
                    
                    const Messages = channel.messages.fetch();

                    if (Target) {
                        let i = 0;
                        const Filtered = [];

                        (await Messages).filter((m) => {
                            if (m.author.id === Target.id && Amount > 1) {
                                Filtered.push(m);
                                i++
                            }
                        });

                        await channel.bulkDelete(Filtered, true)
                            .then(messages => {
                                EditReply(interaction, "✂️", `Limpiados ${messages.size} mensajes, de ${Target}.`, client.color);
                            });
                    } else {
                        await channel.bulkDelete(Amount, true)
                            .then(messages => {
                                EditReply(interaction, "✂️", `He limpiado ${messages.size} mensajes del canal correctamente!`, client.color);
                            });
                    }
                }
        }
    },
};
