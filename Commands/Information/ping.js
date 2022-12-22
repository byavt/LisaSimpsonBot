const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "ping",
    description: "Displays the bot's current latency",
    category: "Informacion",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        return EditReply(interaction, "✅", `La latencia del Websocket actual es de: \`${client.ws.ping} ms\``);
    },
};