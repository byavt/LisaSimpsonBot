const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
    client.defaultEQ = [
        {
            band: 0,
            gain: 0.25,
        },
        {
            band: 1,
            gain: 0.025,
        },
        {
            band: 2,
            gain: 0.0125,
        },
        {
            band: 3,
            gain: 0,
        },
        {
            band: 4,
            gain: 0,
        },
        {
            band: 5,
            gain: -0.0125,
        },
        {
            band: 6,
            gain: -0.025,
        },
        {
            band: 7,
            gain: -0.0175,
        },
        {
            band: 8,
            gain: 0,
        },
        {
            band: 9,
            gain: 0,
        },
        {
            band: 10,
            gain: 0.0125,
        },
        {
            band: 11,
            gain: 0.025,
        },
        {
            band: 12,
            gain: 0.25,
        },
        {
            band: 13,
            gain: 0.125,
        },
        {
            band: 14,
            gain: 0.125,
        },
    ];
    client.bassboost = {
        none: client.defaultEQ,
        low: [
            {
                band: 0,
                gain: 0.0625,
            },
            {
                band: 1,
                gain: 0.125,
            },
            {
                band: 2,
                gain: -0.125,
            },
            {
                band: 3,
                gain: -0.0625,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: -0.0125,
            },
            {
                band: 6,
                gain: -0.025,
            },
            {
                band: 7,
                gain: -0.0175,
            },
            {
                band: 8,
                gain: 0,
            },
            {
                band: 9,
                gain: 0,
            },
            {
                band: 10,
                gain: 0.0125,
            },
            {
                band: 11,
                gain: 0.025,
            },
            {
                band: 12,
                gain: 0.375,
            },
            {
                band: 13,
                gain: 0.125,
            },
            {
                band: 14,
                gain: 0.125,
            },
        ],
        medium: [
            {
                band: 0,
                gain: 0.125,
            },
            {
                band: 1,
                gain: 0.25,
            },
            {
                band: 2,
                gain: -0.25,
            },
            {
                band: 3,
                gain: -0.125,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: -0.0125,
            },
            {
                band: 6,
                gain: -0.025,
            },
            {
                band: 7,
                gain: -0.0175,
            },
            {
                band: 8,
                gain: 0,
            },
            {
                band: 9,
                gain: 0,
            },
            {
                band: 10,
                gain: 0.0125,
            },
            {
                band: 11,
                gain: 0.025,
            },
            {
                band: 12,
                gain: 0.375,
            },
            {
                band: 13,
                gain: 0.125,
            },
            {
                band: 14,
                gain: 0.125,
            },
        ],
        high: [
            {
                band: 0,
                gain: 0.1875,
            },
            {
                band: 1,
                gain: 0.375,
            },
            {
                band: 2,
                gain: -0.375,
            },
            {
                band: 3,
                gain: -0.1875,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: -0.0125,
            },
            {
                band: 6,
                gain: -0.025,
            },
            {
                band: 7,
                gain: -0.0175,
            },
            {
                band: 8,
                gain: 0,
            },
            {
                band: 9,
                gain: 0,
            },
            {
                band: 10,
                gain: 0.0125,
            },
            {
                band: 11,
                gain: 0.025,
            },
            {
                band: 12,
                gain: 0.375,
            },
            {
                band: 13,
                gain: 0.125,
            },
            {
                band: 14,
                gain: 0.125,
            },
        ],
        earrape: [
            {
                band: 0,
                gain: 0.25,
            },
            {
                band: 1,
                gain: 0.5,
            },
            {
                band: 2,
                gain: -0.5,
            },
            {
                band: 3,
                gain: -0.25,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: -0.0125,
            },
            {
                band: 6,
                gain: -0.025,
            },
            {
                band: 7,
                gain: -0.0175,
            },
            {
                band: 8,
                gain: 0,
            },
            {
                band: 9,
                gain: 0,
            },
            {
                band: 10,
                gain: 0.0125,
            },
            {
                band: 11,
                gain: 0.025,
            },
            {
                band: 12,
                gain: 0.375,
            },
            {
                band: 13,
                gain: 0.125,
            },
            {
                band: 14,
                gain: 0.125,
            },
        ],
    };
    client.eqs = {
        music: client.defaultEQ,
        pop: [
            {
                band: 0,
                gain: -0.2,
            },
            {
                band: 1,
                gain: -0.1,
            },
            {
                band: 2,
                gain: 0,
            },
            {
                band: 3,
                gain: 0.1,
            },
            {
                band: 4,
                gain: 0.15,
            },
            {
                band: 5,
                gain: 0.25,
            },
            {
                band: 6,
                gain: 0.3,
            },
            {
                band: 7,
                gain: 0.35,
            },
            {
                band: 8,
                gain: 0.3,
            },
            {
                band: 9,
                gain: 0.25,
            },
            {
                band: 10,
                gain: 0.15,
            },
            {
                band: 11,
                gain: 0.1,
            },
            {
                band: 12,
                gain: 0,
            },
            {
                band: 13,
                gain: -0.1,
            },
            {
                band: 14,
                gain: -0.2,
            },
        ],
        electronic: [
            {
                band: 0,
                gain: 0.375,
            },
            {
                band: 1,
                gain: 0.35,
            },
            {
                band: 2,
                gain: 0.125,
            },
            {
                band: 3,
                gain: 0,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: -0.125,
            },
            {
                band: 6,
                gain: -0.125,
            },
            {
                band: 7,
                gain: 0,
            },
            {
                band: 8,
                gain: 0.25,
            },
            {
                band: 9,
                gain: 0.125,
            },
            {
                band: 10,
                gain: 0.15,
            },
            {
                band: 11,
                gain: 0.2,
            },
            {
                band: 12,
                gain: 0.25,
            },
            {
                band: 13,
                gain: 0.35,
            },
            {
                band: 14,
                gain: 0.4,
            },
        ],
        classical: [
            {
                band: 0,
                gain: 0.375,
            },
            {
                band: 1,
                gain: 0.35,
            },
            {
                band: 2,
                gain: 0.125,
            },
            {
                band: 3,
                gain: 0,
            },
            {
                band: 4,
                gain: 0,
            },
            {
                band: 5,
                gain: 0.125,
            },
            {
                band: 6,
                gain: 0.55,
            },
            {
                band: 7,
                gain: 0.05,
            },
            {
                band: 8,
                gain: 0.125,
            },
            {
                band: 9,
                gain: 0.25,
            },
            {
                band: 10,
                gain: 0.2,
            },
            {
                band: 11,
                gain: 0.25,
            },
            {
                band: 12,
                gain: 0.3,
            },
            {
                band: 13,
                gain: 0.25,
            },
            {
                band: 14,
                gain: 0.3,
            },
        ],
        rock: [
            {
                band: 0,
                gain: 0.3,
            },
            {
                band: 1,
                gain: 0.25,
            },
            {
                band: 2,
                gain: 0.2,
            },
            {
                band: 3,
                gain: 0.1,
            },
            {
                band: 4,
                gain: 0.05,
            },
            {
                band: 5,
                gain: -0.05,
            },
            {
                band: 6,
                gain: -0.15,
            },
            {
                band: 7,
                gain: -0.2,
            },
            {
                band: 8,
                gain: -0.1,
            },
            {
                band: 9,
                gain: -0.05,
            },
            {
                band: 10,
                gain: 0.05,
            },
            {
                band: 11,
                gain: 0.1,
            },
            {
                band: 12,
                gain: 0.2,
            },
            {
                band: 13,
                gain: 0.25,
            },
            {
                band: 14,
                gain: 0.3,
            },
        ],

        full: [
            {
                band: 0,
                gain: 0.25 + 0.375,
            },
            {
                band: 1,
                gain: 0.25 + 0.025,
            },
            {
                band: 2,
                gain: 0.25 + 0.0125,
            },
            {
                band: 3,
                gain: 0.25 + 0,
            },
            {
                band: 4,
                gain: 0.25 + 0,
            },
            {
                band: 5,
                gain: 0.25 + -0.0125,
            },
            {
                band: 6,
                gain: 0.25 + -0.025,
            },
            {
                band: 7,
                gain: 0.25 + -0.0175,
            },
            {
                band: 8,
                gain: 0.25 + 0,
            },
            {
                band: 9,
                gain: 0.25 + 0,
            },
            {
                band: 10,
                gain: 0.25 + 0.0125,
            },
            {
                band: 11,
                gain: 0.25 + 0.025,
            },
            {
                band: 12,
                gain: 0.25 + 0.375,
            },
            {
                band: 13,
                gain: 0.25 + 0.125,
            },
            {
                band: 14,
                gain: 0.25 + 0.125,
            },
        ],
        gaming: [
            {
                band: 0,
                gain: 0.35,
            },
            {
                band: 1,
                gain: 0.3,
            },
            {
                band: 2,
                gain: 0.25,
            },
            {
                band: 3,
                gain: 0.2,
            },
            {
                band: 4,
                gain: 0.15,
            },
            {
                band: 5,
                gain: 0.1,
            },
            {
                band: 6,
                gain: 0.05,
            },
            {
                band: 7,
                gain: -0.0,
            },
            {
                band: 8,
                gain: -0.05,
            },
            {
                band: 9,
                gain: -0.1,
            },
            {
                band: 10,
                gain: -0.15,
            },
            {
                band: 11,
                gain: -0.2,
            },
            {
                band: 12,
                gain: -0.25,
            },
            {
                band: 13,
                gain: -0.3,
            },
            {
                band: 14,
                gain: -0.35,
            },
        ],
    };

    const DB = require("../../Structures/Database/Schemas/Modlogs");

    client.modLogs = async (Guild, User, Target, Reason, Action) => {
        const Data = await DB.findOne({ Guild: Guild.id });
        if (!Data) return;

        const Channel = Guild.channels.cache.get(Data.Channel);
        if (!Channel) return;

        switch (Action) {
            case "ban":
                {
                    const Embed = new EmbedBuilder()
                        .setColor("Red")
                        .setThumbnail(Target.user.displayAvatarURL())
                        .setTitle(`${Target.user.username} Ha Sido Baneado!`)
                        .addFields({
                            name: "Nombre:",
                            value: `${Target.user.tag}`,
                            inline: true,
                        }, {
                            name: "Baneado por:",
                            value: `${User.tag}`,
                            inline: true,
                        }, {
                            name: "Razon",
                            value: `${Reason}`,
                            inline: true
                        })
                        .setFooter({ text: Target.id })
                        .setTimestamp();

                    const Row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("ban_unban")
                                .setLabel("Desbanear")
                                .setStyle(ButtonStyle.Danger),
                        );

                    await Channel.send({
                        embeds: [Embed],
                        components: [Row]
                    });
                }
                break;
            case "nuke":
                {
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: `${User.username}`, iconURL: `${User.displayAvatarURL()}` })
                        .setColor("Red")
                        .setThumbnail(User.displayAvatarURL())
                        .setTitle(`Un canal ha sido nukeado!`)
                        .addFields({
                            name: "Canal:",
                            value: `\`${Target.name.toUpperCase()} (${Target.id})\``,
                            inline: true,
                        }, {
                            name: "Ejecutor:",
                            value: `\`${User.tag} (${User.id})\``,
                            inline: true
                        })
                        .setTimestamp();

                    await Channel.send({
                        embeds: [Embed],
                    });
                }
                break;
            case "":
                {

                }
                break;
        }
    }
};
