const { Client } = require("discord.js");
const { blue } = require("chalk");
/**
 * 
 * @param {Client} client 
 * @param {*} PG 
 */
module.exports = async (client, PG) => {
    const PlayerFiles = await PG(`${process.cwd()}/PlayerEvents/*.js`);

    let Loaded = 0;

    PlayerFiles.map(async file => {
        const event = require(file);

        client.player.on(event.name, (...args) => event.execute(...args, client));

        Loaded++;
    });

    if (Loaded !== 0) console.log(blue(`Loaded ${Loaded} player events!`));
}