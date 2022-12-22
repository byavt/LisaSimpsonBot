const {
    Client,
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
const { Player } = require("erela.js");
const Reply = require("../../Systems/Reply");
const DB = require("../../Structures/Database/Schemas/Message");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Player} player
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { channel, guild, user, member, customId } = interaction;

        if (!interaction.isButton()) return;
        if (
            ![
                "filters_3d",
                "filters_bassboost",
                "filters_nightcore",
                "filters_vibrate",
                "filters_vibrato",
                "filters_clear",
            ].includes(customId)
        )
            return;

        if (await VC(interaction, client)) return;

        const player = client.player.get(guild.id);
        if (!player && !player?.playing && !player?.paused)
            return Reply(
                interaction,
                process.env.Cross,
                "No hay nada sonando!",
                true
            );

        const Message = interaction.message;

        const Data = await DB.findOne({
            Guild: guild.id,
        });
        const fetched = await channel.messages.fetch(Data.Message);

        switch (customId) {
            case "filters_3d":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    player.node.send({
                        op: "filters",
                        guildId: guild.id,
                        equalizer: player.bands.map((gain, index) => {
                            var Obj = {
                                band: 0,
                                gain: 0,
                            };
                            Obj.band = Number(index);
                            Obj.gain = Number(gain);
                            return Obj;
                        }),
                        rotation: {
                            rotationHz: 0.2,
                        },
                    });

                    return EditReply(
                        interaction,
                        process.env.Succes,
                        `**¡Filtro \`3D\` habilitado con éxito! ¡Haz clic en \`Limpiar filtro\` para desactivarlo!**`,
                        client.color
                    );
                }
                break;
            case "filters_bassboost":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    const Embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle("🎧 | Niveles de Bassboost")
                        .setDescription(
                            `Elija un nivel de refuerzo de graves: \`🔇Ninguno\` | \`🔈Bajo\` | \`🔊 Medio\` | \`🔊 Alto\``
                        )
                        .setTimestamp();

                    const Row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("bassboost_none")
                            .setEmoji("🔇")
                            .setLabel("Nada")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("bassboost_low")
                            .setEmoji("🔈")
                            .setLabel("Bajo")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("bassboost_medium")
                            .setEmoji("🔉")
                            .setLabel("Medio")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("bassboost_high")
                            .setEmoji("🔊")
                            .setLabel("Alto")
                            .setStyle(ButtonStyle.Success)
                    );

                    const Message = await interaction.editReply({
                        embeds: [Embed],
                        components: [Row],
                    });

                    const Collector = Message.createMessageComponentCollector({
                        filter: (i) =>
                            i.user.id === interaction.user.id && i.message.id === Message.id,
                        time: 60000,
                        componentType: ComponentType.Button,
                    });

                    Collector.on("collect", async (i) => {
                        await i.deferReply({ ephemeral: true });

                        if (i.customId === "bassboost_none") {
                            player.setEQ(client.bassboost.none);
                            player.node.send({
                                op: "filters",
                                guildId: guild.id,
                                equalizer: player.bands.map((gain, index) => {
                                    var Obj = {
                                        band: 0,
                                        gain: 0,
                                    };
                                    Obj.band = Number(index);
                                    Obj.gain = Number(gain);
                                    return Obj;
                                }),
                                timescale: {
                                    speed: 1.0,
                                    pitch: 1.0,
                                    rate: 1.0,
                                },
                            });

                            return EditReply(
                                i,
                                process.env.Succes,
                                `¡Nivel de refuerzo de graves establecido en \`🔇Ninguno\`!`,
                                client.color
                            );
                        } else if (i.customId === "bassboost_low") {
                            player.setEQ(client.bassboost.low);
                            player.node.send({
                                op: "filters",
                                guildId: guild.id,
                                equalizer: player.bands.map((gain, index) => {
                                    var Obj = {
                                        band: 0,
                                        gain: 0,
                                    };
                                    Obj.band = Number(index);
                                    Obj.gain = Number(gain);
                                    return Obj;
                                }),
                                timescale: {
                                    speed: 1.0,
                                    pitch: 1.0,
                                    rate: 1.0,
                                },
                            });

                            return EditReply(
                                i,
                                process.env.Succes,
                                `¡Nivel de refuerzo de graves establecido en \`🔈Bajo\`!`,
                                client.color
                            );
                        } else if (i.customId === "bassboost_medium") {
                            player.setEQ(client.bassboost.medium);
                            player.node.send({
                                op: "filters",
                                guildId: guild.id,
                                equalizer: player.bands.map((gain, index) => {
                                    var Obj = {
                                        band: 0,
                                        gain: 0,
                                    };
                                    Obj.band = Number(index);
                                    Obj.gain = Number(gain);
                                    return Obj;
                                }),
                                timescale: {
                                    speed: 1.0,
                                    pitch: 1.0,
                                    rate: 1.0,
                                },
                            });

                            return EditReply(
                                i,
                                process.env.Succes,
                                `¡Nivel de refuerzo de graves establecido en \`🔈Medio\`!`,
                                client.color
                            );
                        } else if (i.customId === "bassboost_high") {
                            player.setEQ(client.bassboost.high);
                            player.node.send({
                                op: "filters",
                                guildId: guild.id,
                                equalizer: player.bands.map((gain, index) => {
                                    var Obj = {
                                        band: 0,
                                        gain: 0,
                                    };
                                    Obj.band = Number(index);
                                    Obj.gain = Number(gain);
                                    return Obj;
                                }),
                                timescale: {
                                    speed: 1.0,
                                    pitch: 1.0,
                                    rate: 1.0,
                                },
                            });

                            return EditReply(
                                i,
                                process.env.Succes,
                                `¡Nivel de refuerzo de graves establecido en \`🔈Alto\`!`,
                                client.color
                            );
                        }
                    });

                    Collector.on("end", async () => {
                        interaction.editReply({
                            components: []
                        })
                    })
                }
                break;
            case "filters_nightcore":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    player.node.send({
                        op: "filters",
                        guildId: guild.id,
                        equalizer: player.bands.map((gain, index) => {
                            var Obj = {
                                band: 0,
                                gain: 0,
                            };
                            Obj.band = Number(index);
                            Obj.gain = Number(gain);
                            return Obj;
                        }),
                        timescale: {
                            speed: 1.165,
                            pitch: 1.125,
                            rate: 1.05,
                        },
                    });

                    return EditReply(
                        interaction,
                        process.env.Succes,
                        `**¡Filtro \`Nightcore\` habilitado con éxito! ¡Haz clic en \`Borrar filtro\` para desactivarlo!**`,
                        client.color
                    );
                }
                break;
            case "filters_vibrate":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    player.node.send({
                        op: "filters",
                        guildId: guild.id,
                        equalizer: player.bands.map((gain, index) => {
                            var Obj = {
                                band: 0,
                                gain: 0,
                            };
                            Obj.band = Number(index);
                            Obj.gain = Number(gain);
                            return Obj;
                        }),
                        vibrato: {
                            frequency: 4.0, // 0 < x
                            depth: 0.75, // 0 < x ≤ 1
                        },
                    });

                    return EditReply(
                        interaction,
                        process.env.Succes,
                        `**¡Filtro \`Vibrate\` habilitado con éxito! ¡Haz clic en \`Borrar filtro\` para desactivarlo!**`,
                        client.color
                    );
                }
                break;
            case "filters_vibrato":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    player.node.send({
                        op: "filters",
                        guildId: guild.id,
                        equalizer: player.bands.map((gain, index) => {
                            var Obj = {
                                band: 0,
                                gain: 0,
                            };
                            Obj.band = Number(index);
                            Obj.gain = Number(gain);
                            return Obj;
                        }),
                        vibrato: {
                            frequency: 4.0, // 0 < x
                            depth: 0.75, // 0 < x ≤ 1
                        },
                    });

                    return EditReply(
                        interaction,
                        process.env.Succes,
                        `**¡Filtro \`Vibrato\` habilitado con éxito! ¡Haz clic en \`Borrar filtro\` para desactivarlo!**`,
                        client.color
                    );
                }
                break;
            case "filters_clear":
                {
                    await interaction.deferReply({
                        ephemeral: true,
                    });

                    player.clearEQ();
                    player.node.send({
                        op: "filters",
                        guildId: guild.id,
                        equalizer: player.bands.map((gain, index) => {
                            var Obj = {
                                band: 0,
                                gain: 0,
                            };
                            Obj.band = Number(index);
                            Obj.gain = Number(gain);
                            return Obj;
                        }),
                    });

                    return EditReply(
                        interaction,
                        process.env.Succes,
                        `**Se borraron con éxito todos los filtros activos**`,
                        client.color
                    );
                }
                break;
        }
    },
};

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 * @returns Check if user is in the voice channel.
 */
async function VC(interaction, client) {
    const VoiceChannel = interaction.member.voice.channel;

    if (!VoiceChannel)
        return Error(
            interaction,
            process.env.Cross,
            "Necesitas estar en un **Canal de Voz**!",
        );

    if (
        interaction.guild.members.me.voice.channelId &&
        VoiceChannel.id !== interaction.guild.members.me.voice.channelId
    )
        return Error(
            interaction,
            process.env.Cross,
            `Tienes que estar en el mismo canal de voz que yo para reproducir una canción!`,
        );

    if (!VoiceChannel.joinable)
        return Error(
            interaction,
            process.env.Cross,
            "No tengo permiso para unirme a tu canal de voz!",
        );

    return false;
}
