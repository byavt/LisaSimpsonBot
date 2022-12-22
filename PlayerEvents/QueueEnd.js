const { Client, EmbedBuilder } = require("discord.js");
const { blue, bgBlueBright } = require("chalk");
const { Player } = require("erela.js");
const DB = require("../Structures/Database/Schemas/Message");

module.exports = {
    name: "queueEnd",
    /**
     * 
     * @param {Player} player 
     * @param {import("erela.js").Track} track
     * @param {import("erela.js").LoadType} type
     * @param {Client} client 
     */
    async execute(player, track, type, client) {
        const Channel = client.channels.cache.get(player.textChannel);
        const Data = await DB.findOne({ Guild: Channel.guild.id });
        let fetched;

        if (Data) {
            fetched = (await Channel.messages.fetch(Data.Message));

            if (fetched) await fetched.edit({
                embeds: [new EmbedBuilder().setColor(client.color).setTitle("LA COLA HA FINALIZADO").setFooter({ text: "Usa /play <Cancion/URL> para añadir canciones a la cola!" })],
                components: []
            });

            await Data.delete();
        }

        await player.destroy();

        console.log(bgBlueBright(blue(`[QUEUE] Cola de ${client.guilds.cache.get(player.guild).name} ha acabado!`)));
    },
};