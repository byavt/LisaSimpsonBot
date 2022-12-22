const { Client, CommandInteraction, InteractionType } = require("discord.js");
const { ApplicationCommand } = InteractionType;
const Reply = require("../../Systems/Reply");

module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { user, guild, commandName, member, type } = interaction;

        if (!guild || user.bot) return;

        if (type !== ApplicationCommand) return;

        const command = client.commands.get(commandName);

        if (!command) return Reply(interaction, "❌", `¡Ocurrió un error al ejecutar el comando!`, true) && client.commands.delete(commandName);

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply(interaction, "❌", `Necesitas el(los) permiso(s) \`${command.UserPerms.join(", ")}\` para ejectuar este comando!`, true);

        if (command.BotPerms && command.BotPerms.length !== 0) if (!guild.members.me.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `Necesito el(los) permiso(s) \`${command.BotPerms.join(", ")}\` para completar la ejecuccion del comando!`, true);

        command.execute(interaction, client);
    },
};