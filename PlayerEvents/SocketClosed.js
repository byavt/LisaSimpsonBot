const { Client } = require("discord.js");
const { red } = require("chalk");
const DB = require("../Structures/Database/Schemas/Message");

module.exports = {
    name: "socketClosed",
    /**
     * 
     * @param {Player} player 
     * @param {Client} client 
     */
    async execute(player, client) {
        await player.destroy();

        const Channel = client.channels.cache.get(player.textChannel);
        const Data = await DB.findOne({ Guild: guild.id });

        if (Data) await Data.delete();

        console.log(red(`Conexion con el Websocket finalizada!`));
    },
};