const {
    Client,
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MembershipScreeningFieldType,
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
        if (!["alt_ban", "alt_kick", "alt_warn", "alt_let"].includes(customId)) return;     

        await interaction.deferReply({ ephemeral: true });

        if (!member.permissions.has("Administrator")) return EditReply(interaction, process.env.Cross, "No puedes usar eso!", "Red");

        const Embed = new EmbedBuilder().setColor("Red");

        const Row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("action-confirm")
                    .setLabel("Confirmar")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("action-cancel")
                    .setLabel("Cancelar")
                    .setStyle(ButtonStyle.Success)
            );

        const Action = customId.replace("alt_", "");

        let Actions = [
            { "ban": "Banear" },
            { "kick": "kick" },
            { "warn": "warn" },
        ]
        
        const Page = await interaction.editReply({
            embeds: [
                Embed
                    .setDescription(`${process.env.Warn} Estas seguro de que quieres **${Actions[Action.toLowerCase()]}**  al usuario?`)
            ],
            components: [Row]
        });

        const Collector = Page.createMessageComponentCollector({
            filter: (i) => i?.user.id === user.id,
            max: 1,
            time: 20000
        });

        Collector.on("collect", async (i) => {
            await i.deferReply({ ephemeral: true });
            
            const Member = i.guild.members.cache.get(interaction.message.embeds[0].footer.text);
            if (!Member) return EditReply(i, "❌", "No he podido encontrar a ese miembro!", "Red");

            if (i.customId === "action-confirm") {
                switch (Action) {
                    case "ban":
                        {
                            const Member = i.guild.members.cache.get(interaction.message.embeds[0].footer.text);
                            if (!Member) return EditReply(i, "❌", "No he podido encontrar a ese miembro!", "Red");

                            await Member.send({
                                embeds: [
                                    Embed
                                        .setAuthor({ name: "Sistema Anti-Alts", iconURL: Member.user.displayAvatarURL() })
                                        .setThumbnail(Member.user.displayAvatarURL())
                                        .setDescription(`Has sido **Baneado** de ${guild.name} por ser una cuenta alternativa.`)
                                        .setFooter({ text: "Vuelve pronto!" })
                                        .setTimestamp(),
                                ]
                            }).then(async () => {
                                await Member.ban({ reason: "Cuenta alternativa" })
                                    .then(async () => {
                                        return EditReply(i, process.env.Cross, `Se ha **BANEADO** al usuario correctamente!`)
                                    }).catch((err) => {
                                        if (err.code !== 50007) {
                                            console.log(err.stack);
                                        }
                                    });
                            });

                            
                        }
                        break;
                    case "kick":
                        {
                            const Member = i.guild.members.cache.get(interaction.message.embeds[0].footer.text);
                            if (!Member) return EditReply(i, "❌", "No he podido encontrar a ese miembro!", "Red");

                            await Member.send({
                                embeds: [
                                    Embed
                                        .setAuthor({ name: ":policestop: Sistema Anti-Alts", iconURL: Member.user.displayAvatarURL() })
                                        .setThumbnail(Member.user.displayAvatarURL())
                                        .setDescription(`Has sido **Expulsado** de ${guild.name} por ser una cuenta alternativa.`)
                                        .setFooter({ text: "Vuelve pronto!" })
                                        .setTimestamp(),
                                ]
                            }).then(async() => {
                                await Member.kick({ reason: "Cuenta alternativa" })
                                    .then(async () => {
                                        return EditReply(i, process.env.Cross, `Se ha **EXPULSADO** al usuario correctamente!`)
                                    }).catch((err) => {
                                        if (err.code !== 50007) {
                                            console.log(err.stack);
                                        }
                                    });
                            })
                        }
                        break;
                    case "warn":
                        {
                            const Member = i.guild.members.cache.get(interaction.message.embeds[0].footer.text);
                            if (!Member) return EditReply(i, "❌", "No he podido encontrar a ese miembro!", "Red");

                            await Member.send({
                                embeds: [
                                    Embed
                                        .setAuthor({ name: ":policestop: Sistema Anti-Alts", iconURL: Member.user.displayAvatarURL() })
                                        .setTitle(`${process.env.Warn} Advertencia`)
                                        .setThumbnail(Member.user.displayAvatarURL())
                                        .setDescription(`Has sido **Alertado** de ${guild.name} por ser una cuenta alternativa.`)
                                        .setFooter({ text: "Vuelve pronto!" })
                                        .setTimestamp(),
                                ]
                            }).catch((err) => {
                                if (err.code !== 50007) {
                                    console.log(err.stack);
                                }
                            });
                        }
                        break;
                }
            } else if (i.customId === "action-cancel") {
                return EditReply(i, process.env.Succes, `Solicitud de **${Action}** cancelada!`, "Red");
            }
        });
    },
};
