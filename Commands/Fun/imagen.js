const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");
const { NekoBot } = require("nekobot-api");
const NekoClient = new NekoBot();
const superagent = require("superagent");
const EditReply = require("../../Systems/EditReply");
const Reply = require("../../Systems/Reply");

module.exports = {
    name: "imagenes",
    description: "Genera imagenes.",
    Category: "Image",
    options: [
        {
            name: "nsfw",
            description: "Genera imagenes NSFW (+18).",
            type: 2,
            options: [
                {
                    name: "anal",
                    description: "Dale por el trasero a alguien.",
                    type: 1,
                    options: [
                        {
                            name: "usuario",
                            description: "El usuario.",
                            type: 6,
                            required: true,
                        },
                    ],
                },
                {
                    name: "follar",
                    description: "Follate a alguien.",
                    type: 1,
                    options: [
                        {
                            name: "usuario",
                            description: "El usuario.",
                            type: 6,
                            required: true,
                        },
                    ],
                },
                {
                    name: "tetas",
                    description: "Manda una foto de unas tetas.",
                    type: 1,
                },
                {
                    name: "coño",
                    description: "Manda una foto de un coño.",
                    type: 1,
                },
                {
                    name: "hentai",
                    description: "Manda una foto hentai.",
                    type: 1,
                },
                {
                    name: "gifporno",
                    description: "Manda una GIF porno.",
                    type: 1,
                },
            ],
        },
    ],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { channel, user, options } = interaction;

        const SubCommandGroup = options.getSubcommandGroup();
        const Embed = new EmbedBuilder();

        switch (SubCommandGroup) {
            case "nsfw":
                {
                    if (!channel.nsfw)
                        return Reply(
                            interaction,
                            process.env.Cross,
                            "El canal debe ser **NSFW** para ejecutar el comando.",
                            true
                        );

                    const Sub = options.getSubcommand(false);

                    switch (Sub) {
                        case "anal":
                            {
                                await interaction.deferReply();

                                const User = options.getUser("usuario");
                                const Image = await NekoClient.get("anal");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(
                                                `**${user.username}** le hace un anal a **${User.username}**`
                                            )
                                            .setImage(Image)
                                            .setFooter({
                                                text: `Anal a ${User.username}`,
                                                iconURL: User.displayAvatarURL(),
                                            })
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                        case "follar":
                            {
                                await interaction.deferReply();

                                const User = options.getUser("usuario");
                                const Image = await NekoClient.get("hentai");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(
                                                `**${user.username}** se folló a **${User.username}**`
                                            )
                                            .setImage(Image)
                                            .setFooter({
                                                text: `Follada para ${User.username}`,
                                                iconURL: User.displayAvatarURL(),
                                            })
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                        case "tetas":
                            {
                                await interaction.deferReply();

                                const Image = await NekoClient.get("boobs");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(`Aqui tienes tu foto **${user.username}**`)
                                            .setImage(Image)
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                        case "coño":
                            {
                                await interaction.deferReply();

                                const Image = await NekoClient.get("pussy");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(`Aqui tienes tu foto **${user.username}**`)
                                            .setImage(Image)
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                        case "hentai":
                            {
                                await interaction.deferReply();

                                const Image = await NekoClient.get("hentai");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(`Aqui tienes tu foto **${user.username}**`)
                                            .setImage(Image)
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                        case "gifporno":
                            {
                                await interaction.deferReply();

                                const Image = await NekoClient.get("pgif");

                                return interaction.editReply({
                                    embeds: [
                                        Embed.setColor(client.color)
                                            .setTitle(`Aqui tienes tu gif **${user.username}**`)
                                            .setImage(Image)
                                            .setTimestamp(),
                                    ],
                                });
                            }
                            break;
                    }
                }
                    break;
        }
    },
};
