const {
    Client,
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Player} player
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { message, channel, guild, user, member, customId } = interaction;

        if (!interaction.isButton()) return;
        if (!["ban_unban"].includes(customId)) return;

        await interaction.deferReply({ ephemeral: true });

        const Embed = new EmbedBuilder().setColor(client.color);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("ban-yes")
                .setLabel("Confirmar"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("ban-no")
                .setLabel("Cancelar")
        );

        const Page = await interaction.editReply({
            embeds: [
                Embed.setDescription(
                    `**${process.env.Warn} | ¿De verdad quieres desbanear a este miembro?**`
                ),
            ],
            components: [row],
        });

        const col = Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s"),
        });

        col.on("collect", async i => {
            switch (i.customId) {
                case "ban-yes":
                    {
                        await guild.members.unban(message.embeds[0].footer.text).then(async (Member) => {
                            const Embed = new EmbedBuilder()
                                .setColor(client.color)
                                .setThumbnail(Member.displayAvatarURL())
                                .setTitle(`${Member.username} Ha Sido Desbaneado!`)
                                .addFields({
                                    name: "Nombre:",
                                    value: `${Member.tag}`,
                                    inline: true,
                                }, {
                                    name: "Desbaneado por:",
                                    value: `${user.tag}`,
                                    inline: true,
                                })
                                .setFooter({ text: Member.id })
                                .setTimestamp();

                            if (message.editable) {
                                await message.edit({
                                    embeds: [Embed],
                                    components: []
                                });
                            }

                            EditReply(interaction, "✅", `${member} ha sido desbaneado!`);
                        });
                    }
                    break;
                case "ban-no":
                    {
                        interaction.editReply({
                            embeds: [Embed.setDescription(`${process.env.Succes} | Solicitud de desbaneo cancelada!`)],
                            components: [],
                        });
                    }
            }
        })
    },
};
