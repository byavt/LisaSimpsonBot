const { Client } = require("discord.js");
const Connect = require("../../Structures/Database/Connection/MongoDB");
const ms = require("ms");

module.exports = {
    name: "ready",
    /**
    * @param {Client} client
    */
    async execute(client) {
        const { user, ws } = client;

        console.log(`${user.tag} is now online!`);

        setInterval(() => {
            const ping = ws.ping;

            user.setActivity({
                name: `Ping: ${ping} ms`,
                type: 3,
            })
        }, ms("5s"));

        await Connect();

        client.player.init(user.id);
    },
};