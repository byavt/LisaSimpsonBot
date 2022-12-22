const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
} = require("discord.js");
const Reply = require("../../Systems/Reply");
const { pagination } = require("../../Systems/Pagination");

module.exports = {
    name: "ayuda",
    description: "Mira mis comandos.",
    Category: "Information",
    options: [{
        name: "comando",
        description: "Proporciona el nombre del comando para ayuda avanzada.",
        type: 3,
        required: false,
    }],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {
            guild,
            member,
            options
        } = interaction;

        const CName = options.getString("comando");

        if (CName) {
            const Command = client.commands.get(CName);

            if (!Command) {
                return Reply(interaction, process.env.Cross, "El comando que proporcionó no es válido, use \`/ayuda\` para obtener la lista completa de comandos.");
            }

            if (Command) {
                const Embed = new EmbedBuilder()
                    .setTitle(`Detalles del comando`)
                    .addFields([
                        {
                            name: "Comando:",
                            value: `\`${Command.name}\``,
                            inline: true
                        },
                        {
                            name: "Descripción:",
                            value: `\`${Command.description}\``,
                            inline: true
                        },
                        {
                            name: "Permisos Necesarios:",
                            value: `\`${Command.UserPerms || "No se proporcionaron permisos de usuario para este comando"}\``,
                            inline: true
                        },
                        {
                            name: "Permisos Que Necesito:",
                            value: `\`${Command.BotPerms || "No se proporcionaron permisos de bot para este comando"}\``,
                            inline: true
                        }
                    ])
                    .setColor(client.color);

                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true,
                });
            };
        }

        const Embed = new EmbedBuilder().setColor(client.color);

        const adminCommands = client.commands.filter(
            (cmd) => cmd.Category === "Administration"
        );
        const funCommands = client.commands.filter(
            (cmd) => cmd.Category === "Fun"
        );
        const infoCommands = client.commands.filter(
            (cmd) => cmd.Category === "Information"
        );
        const modCommands = client.commands.filter(
            (cmd) => cmd.Category === "Moderation"
        );
        const imageCommands = client.commands.filter(
            (cmd) => cmd.Category === "Image"
        );

        const AdminCommands = adminCommands.map((cmd) => {
            return {
                name: `\`/${cmd.name}\``,   
                value: `${cmd.description}`,
                inline: true,
            };
        });

        const FunCommands = funCommands.map((cmd) => {
            return {
                name: `**Comando:** \`/${cmd.name}\``,
                value: `**Subcomandos:**
                    ${cmd.options ? cmd.options.map(comd => {
                        return `\`/${cmd.name} ${comd.name}\``
                    }).join("\n") : "no hay subcomandos."}
                **Grupo de Subcomandos:**
                    \`/diversión mini-juegos snake\`
                    \`/diversión mini-juegos buscaminas\`
                    \`/diversión mini-juegos conecta4\`
                    \`/diversión mini-juegos piedrapapeltijera\`
                    \`/diversión mini-juegos ahorcado\`
                    \`/diversión mini-juegos 2048\`
                    \`/diversión mini-juegos trivia\`
                **Descripción:** \`${cmd.description}\``,
                inline: true,
            };
        });

        const ImageCommands = imageCommands.map((cmd) => {
            return {
                name: `**Comando:** \`/${cmd.name}\``,
                value: `**Subcomandos:**
                    ${cmd.options ? cmd.options.map(comd => {
                        return `\`/${cmd.name} ${comd.name}\``
                    }).join("\n") : "no hay subcomandos."}
                **Grupo de Subcomandos:**
                    \`/imagenes nsfw anal\`
                    \`/imagenes nsfw follar\`
                    \`/imagenes nsfw tetas\`
                    \`/imagenes nsfw coño\`
                    \`/imagenes nsfw hentai\`
                    \`/imagenes nsfw gifporno\`
                    \`/imagenes sfw guantazo\`
                **Descripción:** \`${cmd.description}\``,
                inline: true,
            }
        });

        const InfoCommands = infoCommands.map((cmd) => {
            return {
                name: `**Comando:** \`/${cmd.name}\``,
                value: `**Descripción:** \`${cmd.description}\``,
                inline: true,
            };
        });

        const ModCommands = modCommands.map((cmd) => {
            return {
                name: `**Comando:** \`/${cmd.name}\``,
                value: `**Subcomandos:**
                    ${cmd.options ? cmd.options.map(cmd => {
                        return `\`/moderación ${cmd.name}\``
                    }).join("\n") : "no hay subcomandos."}
                **Grupo de Subcomandos:**:
                    \`/moderación warn añadir\`
                    \`/moderación warn remover\`
                    \`/moderación warn lista\`
                **Descripción:** \`${cmd.description}\``,
                inline: true,
            };
        });

        const Home = new EmbedBuilder()
            .setTitle("🔥 | Comandos del Bot")
            .setDescription("Para ver la información de un comando usa \`/ayuda [comando]\`\n\n**Categorías:**\n> <:Administration:1017154725700964392> Administración\n> 🎲 Diversion\n> 🖼 Imagenes\n> :information_source: Información\n> <:Moderation:1017154686912045056> Moderación")
            .setColor("White");

        const Administration = new EmbedBuilder()
            .setTitle(
                `> [\`${client.commands.filter((cmd) => cmd.Category === "Administration")
                    .size
                }\`] Comandos de Administración`
            )
            .setDescription(
                "Use `/ayuda` seguido de un nombre de comando para obtener más información sobre un comando.\nPor ejemplo: `/ayuda ping`."
            )
            .addFields(AdminCommands)
            .setColor("Red");
        
        const Fun = new EmbedBuilder()
            .setTitle(
                `> [\`${client.commands.filter((cmd) => cmd.Category === "Fun")
                    .size
                }\`] Comandos de Diversión`
            )
            .setDescription(
                "Use `/ayuda` seguido de un nombre de comando para obtener más información sobre un comando.\nPor ejemplo: `/ayuda ping`."
            )
            .addFields(FunCommands)
            .setColor("Green");

        const Image = new EmbedBuilder()
            .setTitle(
                `> [\`${client.commands.filter((cmd) => cmd.Category === "Image")
                    .size
                }\`] Comandos de Imagenes/Acciones`
            )
            .setDescription(
                "Use `/ayuda` seguido de un nombre de comando para obtener más información sobre un comando.\nPor ejemplo: `/ayuda ping`."
            )
            .addFields(ImageCommands)
            .setColor("Blue");

        const Information = new EmbedBuilder()
            .setTitle(
                `> [\`${client.commands.filter((cmd) => cmd.Category === "Information")
                    .size
                }\`] Comandos de Informacion`
            )
            .setDescription(
                "Use `/ayuda` seguido de un nombre de comando para obtener más información sobre un comando.\nPor ejemplo: `/ayuda ping`."
            )
            .addFields(InfoCommands)
            .setColor("Aqua");

        const Moderation = new EmbedBuilder()
            .setTitle(
                `> [\`${client.commands.filter((cmd) => cmd.Category === "Moderation")
                    .size
                }\`] Comandos de Moderación`
            )
            .setDescription(
                "Use `/ayuda` seguido de un nombre de comando para obtener más información sobre un comando.\nPor ejemplo: `/ayuda ping`."
            )
            .addFields(ModCommands)
            .setColor("Orange");

        const Embeds = [Home, Administration, Fun, Image, Information, Moderation];

        pagination(interaction, Embeds);
    },
};