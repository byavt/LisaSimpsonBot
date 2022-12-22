const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "play",
    description: "Pone la cancion que quieras.",
    Category: "Music",
    options: [
        {
            name: "query",
            description: "Proporcione la URL de la canción o el nombre de la canción.",
            type: 3,
            required: true
        },
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, user, member, channel } = interaction;

        await interaction.deferReply({ ephemeral: true });

        const query = options.getString("query");

        const Erela = client.player;
        let res;

        const VC = member.voice.channel;
        if (!VC) return EditReply(interaction, process.env.Cross, "Necesitas estar en un canal de voz!", client.color);

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return EditReply(interaction, process.env.Cross, "Tienes que estar en el mismo canal de voz que yo para reproducir una canción!", client.color);

        const player = client.player.create({
            guild: guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true
        });

        if (player.state !== "CONNECTED") await player.connect();

        try {
            res = await player.search(query, user);

            if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current) await player.destroy();

                return EditReply(interaction, process.env.Cross, "Ha ocurrido un error, inténtalo de nuevo más tarde!", client.color);
            } else if (res.loadType === "NO_MATCHES") {
                if (!player.queue.current) await player.destroy();

                return EditReply(interaction, process.env.Cross, "No se han encontrado resultados!", client.color);
            } else if (res.loadType === "PLAYLIST_LOADED") {
                player.queue.add(res.tracks);
                await player.play();
                //if (!player.playing && !player.paused && !player.queue.size) await player.play();

                return EditReply(interaction, "🎧", "Solicitud recibida, la musica empezara en unos segundos!", client.color);
            } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {
                player.queue.add(res.tracks[0]);
                await player.play();
                //if (!player.playing && !player.paused && !player.queue.size) await player.play();

                return EditReply(interaction, "🎧", "Solicitud recibida, la musica empezara en unos segundos!", client.color);
            }
        } catch (error) {
            console.error(error);
        }
    },
};