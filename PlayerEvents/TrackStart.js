const {
    Client,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChannelType
} = require("discord.js");
const {
    blue
} = require("chalk");
const {
    Player,
    Queue
} = require("erela.js");
const pms = require("pretty-ms");
const DB = require("../Structures/Database/Schemas/Message");

module.exports = {
    name: "trackStart",
    /**
     * 
     * @param {Player} player 
     * @param {import("erela.js").Track} track
     * @param {import("erela.js").LoadType} type
     * @param {Client} client 
     */
    async execute(player, track, type, client) {
        const Channel = client.channels.cache.get(player.textChannel);
        if (!Channel) return;
        if (Channel.type !== ChannelType.GuildText) return;

        let Data = await DB.findOne({
            Guild: Channel.guild.id
        });

        const Row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("song_previous")
                    .setLabel("Canción Previa")
                    .setEmoji("1030564136498774066")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("song_rewind")
                    .setLabel("-10 Segundos")
                    .setEmoji("1030554703370666078")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("song_pause")
                    .setLabel("Pausar Canción")
                    .setEmoji("1026518174881038437")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("song_forward")
                    .setLabel("+10 Segundos")
                    .setEmoji("1030555215302230166")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("song_next")
                    .setLabel("Saltar Canción")
                    .setEmoji("1030564152999161997")
                    .setStyle(ButtonStyle.Primary)
            );

        const Row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("song_loop")
                    .setLabel("Repetir Canción")
                    .setEmoji("1030571535494291546")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("song_voldown")
                    .setLabel("Subir Volumen")
                    .setEmoji("1030556648781127861")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("song_stop")
                    .setLabel("Parar Canción")
                    .setEmoji("1030572405699125278")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("song_volup")
                    .setLabel("Bajar Volumen")
                    .setEmoji("1030557141750251550")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("song_shuffle")
                    .setLabel("Barajar Canciones")
                    .setEmoji("1030604299971068024")
                    .setStyle(ButtonStyle.Secondary)
            );

        const Row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("song_filters")
                    .setEmoji("🎧")
                    .setLabel("Filtros")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("song_lyrics")
                    .setEmoji("1030605777309806682")
                    .setLabel("Lyrics")
                    .setStyle(ButtonStyle.Success),
            );

        if (Data) {
            const fetched = (await Channel.messages.fetch(Data.Message).catch(() => { }));

            if (fetched) {
                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
                    .setAuthor({ iconURL: "https://i.gifer.com/origin/6a/6af36f7b9c1ac8a7e9d7dbcaa479b616.gif", name: "| Sondando Ahora" })
                    .setDescription(getQueue(player.queue, track))
                    .setFooter(getQueueSettings(player))
                    .setTimestamp();

                await fetched.edit({
                    embeds: [Embed],
                    components: [Row, Row2, Row3]
                });
            } else if (!fetched) {
                await Data.delete();

                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
                    .setAuthor({ iconURL: "https://i.gifer.com/origin/6a/6af36f7b9c1ac8a7e9d7dbcaa479b616.gif", name: "| Sondando Ahora" })
                    .setDescription(getQueue(player.queue, track))
                    .setFooter(getQueueSettings(player))
                    .setTimestamp();

                await Channel.send({
                    embeds: [Embed],
                    components: [Row, Row2, Row3]
                }).then(async m => {
                    Data = new DB({
                        Guild: Channel.guild.id,
                        Message: m.id
                    }).save();
                });
            }
        }

        if (!Data) {
            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
                .setAuthor({ iconURL: "https://i.gifer.com/origin/6a/6af36f7b9c1ac8a7e9d7dbcaa479b616.gif", name: "| Sondando Ahora" })
                .setDescription(getQueue(player.queue, track))
                .setFooter(getQueueSettings(player))
                .setTimestamp();

            await Channel.send({
                embeds: [Embed],
                components: [Row, Row2, Row3]
            }).then(async m => {
                Data = new DB({
                    Guild: Channel.guild.id,
                    Message: m.id
                }).save();
            });
        }
    },
};
/**
 * 
 * @param {Player} player 
 */
function getQueueSettings(player) {
    return {
        text: `Volumen: ${Number(player.volume)} | Loop: ${player.trackRepeat ? "Canción" : "Desactivado"} | Estado: ${player.paused ? "Pausado" : "Sonando"}`
    }
}
/**
 * 
 * @param {Queue} queue 
 * @param {import("erela.js").Track} track
 */
function getQueue(queue, track) {
    if (queue.size == 0) {
        return `🎧 | [${track.title}](${track.uri}) - \`${pms(track.duration)}\` | ${track.requester}\n\n**Mas Canciones:**\n` + `Vacio\ny \`0\` mas...`;
    } else if (queue.size >= 5) {
        return `🎧 | [${track.title}](${track.uri}) - \`${pms(track.duration)}\` | ${track.requester}\n\n**Mas Canciones:**\n${queue.map((track, index) => `**${index + 1}.** [${track.title}](${track.uri}) - \`${pms(track.duration)}\``).slice(0, 5).join("\n").substring(0, 4096)}` + `\ny \`${queue.length - 5}\` mas...`;
    } else if (queue.size <= 5) {
        return `🎧 | [${track.title}](${track.uri}) - \`${pms(track.duration)}\` | ${track.requester}\n**Mas Canciones:**\n${queue.map((track, index) => `**${index + 1}.** [${track.title}](${track.uri}) - \`${pms(track.duration)}\``).slice(0, 5).join("\n")}` + `\ny \`0\` mas...`;
    }
}