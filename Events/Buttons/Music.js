const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Player } = require("erela.js");
const Reply = require("../../Systems/Reply");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
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
        const { guild, user, member, customId } = interaction;

        if (!interaction.isButton()) return;
        if (!["song_previous", "song_rewind", "song_pause", "song_forward", "song_next", "song_loop", "song_voldown", "song_stop", "song_volup", "song_shuffle", "song_lyrics", "song_filters"].includes(customId)) return;

        if (await VC(interaction, client)) return;

        const player = client.player.get(guild.id);
        if (!player && !player?.playing && !player?.paused) return Reply(interaction, process.env.Cross, "No hay nada sonando!", true);

        const Message = interaction.message;

        const Data = await DB.findOne({ Guild: guild.id });

        switch (customId) {
            case "song_previous":
                {
                    await interaction.deferUpdate();

                    if (player.queue.previous === null) return;

                    const res = await player.search(player.queue.previous.uri, user);

                    await player.play(res.tracks[0]);

                    if (!player.playing && !player.paused && player.totalSize === res.tracks.length) return player.play();
                }
                break;
            case "song_rewind":
                {
                    await interaction.deferUpdate();

                    let seektime = player.position - 10 * 1000;
                    if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                        seektime = 0;
                    }

                    player.seek(Number(seektime));
                }
                break;
            case "song_pause":
                {
                    await interaction.deferUpdate();

                    await player.pause(!player.paused)

                    Message.edit({
                        embeds: [EmbedBuilder.from(Message.embeds[0]).setFooter(getQueueSettings(player))]
                    });
                }
                break;
            case "song_forward":
                {
                    await interaction.deferUpdate();

                    let seektime = Number(player.position) + 10 * 1000;

                    if (Number(10) <= 0) seektime = Number(player.position);

                    if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;

                    player.seek(Number(seektime));
                }
                break;
            case "song_next":
                {
                    await interaction.deferUpdate();

                    player.stop();
                }
                break;
            case "song_loop":
                {
                    await interaction.deferUpdate();

                    await player.setTrackRepeat(!player.trackRepeat);

                    Message.edit({
                        embeds: [EmbedBuilder.from(Message.embeds[0]).setFooter(getQueueSettings(player))]
                    });
                }
                break;
            case "song_voldown":
                {
                    await interaction.deferUpdate();

                    const Volume = player.volume - 10;

                    if (Volume < 0 || Volume > 100) return;

                    await player.setVolume(Volume);

                    Message.edit({
                        embeds: [EmbedBuilder.from(Message.embeds[0]).setFooter(getQueueSettings(player))]
                    });
                }
                break;
            case "song_stop":
                {
                    await interaction.deferUpdate();

                    await player.destroy();

                    Message.edit({
                        embeds: [new EmbedBuilder().setColor(client.color).setTitle("LA COLA HA FINALIZADO").setFooter({ text: "Usa /play <Cancion/URL> para añadir canciones a la cola!" })],
                        components: []
                    });

                    if (Data) await Data.delete();
                }
                break;
            case "song_volup":
                {
                    await interaction.deferUpdate();

                    const Volume = player.volume + 10;

                    if (Volume < 0 || Volume > 100) return;

                    await player.setVolume(Volume);

                    Message.edit({
                        embeds: [EmbedBuilder.from(Message.embeds[0]).setFooter(getQueueSettings(player))]
                    });
                }
                break;
            case "song_shuffle":
                {
                    await interaction.deferUpdate();

                    await player.queue.shuffle();
                }
                break;
            case "song_lyrics":
                {
                    await interaction.deferReply({ ephemeral: true });

                    const track = player.queue.current;
                    const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", "");

                    const actualTrack = await gClient.songs.search(trackTitle).catch(() => { return EditReply(interaction, process.env.Cross, "No he encontrado el lyrics para esa cancion!", client.color); });
                    const searches = actualTrack[0];
                    const lyrics = await searches.lyrics();

                    const Embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
                        .setTitle(`Lyrics de ${track.title}`)
                        .setDescription(lyrics.substr(0, 4096))
                        .setTimestamp();

                    return interaction.editReply({
                        embeds: [Embed],
                    })
                }
                break;
            case "song_filters":
                {
                    await interaction.deferReply({ ephemeral: true });

                    const Embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle("🎧 | Filtros")
                        .setDescription("¡Seleccione un filtro de los Botones a continuación!")
                        .setTimestamp();

                    const Row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("filters_3d")
                                .setLabel("3D")
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("filters_bassboost")
                                .setLabel("Bassboost")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("filters_nightcore")
                                .setLabel("Nightcore")
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("filters_vibrate")
                                .setLabel("Vibrate")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("filters_vibrato")
                                .setLabel("Vibrato")
                                .setStyle(ButtonStyle.Primary),
                        );

                    const Row2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("filters_clear")
                                .setLabel("Limpiar Filtro")
                                .setStyle(ButtonStyle.Danger),
                        );

                    return interaction.editReply({
                        embeds: [Embed],
                        components: [Row, Row2]
                    });
                }
                break;
        }
    },
};
/**
 * 
 * @param {Player} player 
 */
function getQueueSettings(player) {
    return {
        text: `Volumen: ${Number(player.volume)} | Loop: ${player.trackRepeat ? "Cancion" : "Desactivado"} | Estado: ${player.paused ? "Pausado" : "Sonando"}`
    }
}
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