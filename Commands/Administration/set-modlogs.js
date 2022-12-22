const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Modlogs");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "set-modlogs",
    description: "Configura el canal de registro de moderación.",
    Category: "Administration",
    UserPerms: ["Administrator"],
    options: [
        {
            name: "canal",
            description: "El canal a ser establecido.",
            type: 7,
            required: true
        },
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { options, guild, user } = interaction;

        const channel = options.getChannel("canal");
        if (!channel.permissionsFor(guild.members.me).has(["ViewChannel", "SendMessage"])) return EditReply(interaction, "❌", "No tengo permisos para Ver/Escribir en ese canal!");

        const data = await DB.findOne({ Guild: guild.id });
        if (data) {
            await DB.updateOne({ Guild: guild.id }, { Channel: channel.id });

            EditReply(interaction, "✅", `El canal de registro de moderación ha sido actualizado a ${channel} correctamente!`);
        } else {
            await DB.create({
                Guild: guild.id,
                Channel: channel.id
            });

            EditReply(interaction, "✅", `El canal de registro de moderación ha sido establecido en ${channel} correctamente!`)
        }
    },
};