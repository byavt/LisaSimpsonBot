module.exports = {
    pagination,
};

const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    SelectMenuBuilder,
} = require("discord.js");
const EditReply = require("./EditReply");
const Reply = require("./Reply");
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {EmbedBuilder[]} embeds
 * @returns
 */
async function pagination(interaction, embeds) {
    if (interaction.deferred == false) {
        await interaction.deferReply();
    };

    let but1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("first")
        .setEmoji("<:Pagination1:999292743719321630>")
        .setDisabled(false);

    let but2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("previous")
        .setEmoji("<:Pagination2:999292810391998515>")
        .setDisabled(false);

    let but3 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("delete")
        .setEmoji("<:Pagination5:1006171346197282857>")
        .setDisabled(false);

    let but4 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("next")
        .setEmoji("<:Pagination3:999292867342237746>")
        .setDisabled(false);

    let but5 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("last")
        .setEmoji("<:Pagination4:999292909155270686>")
        .setDisabled(false);

    const row = new ActionRowBuilder().addComponents(
        but1.setDisabled(false),
        but2.setDisabled(false),
        but3.setDisabled(false),
        but4.setDisabled(false),
        but5.setDisabled(false)
    );

    const select = new SelectMenuBuilder()
        .setCustomId("help_selectmenu")
        .setPlaceholder("⚙️ Escoje una Categoria")
        .setMinValues(1)
        .setOptions([
            {
                label: "Administración",
                value: "Administration",
                emoji: "1017154725700964392"
            },
            {
                label: "Diversíon",
                value: "Diversion",
                emoji: "🎲"
            },
            {
                label: "Imagenes",
                value: "Images",
                emoji: "🖼️",
            },
            {
                label: "Informacíon",
                value: "Information",
                emoji: "ℹ️"
            },
            {
                label: "Moderación",
                value: "Moderation",
                emoji: "1017154686912045056"
            },
        ]);

    const row2 = new ActionRowBuilder().addComponents(select);

    if (embeds.length == 1) {
        return interaction.editReply({
            embeds: [embeds[0]],
            components: [
                new ActionRowBuilder().addComponents(
                    [
                        but1.setDisabled(true),
                        but2.setDisabled(true),
                        but3.setDisabled(true),
                        but4.setDisabled(true),
                        but5.setDisabled(true)
                    ]
                ),
            ],
        });
    }

    embeds = embeds.map((embed, index) => embed);

    const sendMsg = await interaction.editReply({
        embeds: [embeds[0]],
        components: [
            row2,
            new ActionRowBuilder().addComponents(
                but1.setDisabled(true),
                but2.setDisabled(true),
                but3.setDisabled(false),
                but4.setDisabled(false),
                but5.setDisabled(false)
            ),
        ],
    });

    let filter = (m) => m.member.id === interaction.member.id;

    const collector = sendMsg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
        componentType: ComponentType.Button,
    });

    const collector2 = sendMsg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
        componentType: ComponentType.SelectMenu,
    });

    let curPage = 0;

    collector.on("collect", async (b) => {
        if (b.user.id !== interaction.member.id)  
            return EditReply(b, process.env.Cross, "No puedes usar este menu de help! Utiliza /ayuda para ver mis comandos.", client.color);

        await b.deferUpdate().catch((e) => null);

        switch (b.customId) {
            case "next": {
                curPage++;
                if (curPage !== embeds.length - 1) {
                    await sendMsg.edit({
                        embeds: [embeds[curPage]],
                        components: [
                            row2,
                            new ActionRowBuilder().addComponents(
                                but1.setDisabled(false),
                                but2.setDisabled(false),
                                but3.setDisabled(false),
                                but4.setDisabled(false),
                                but5.setDisabled(false)
                            ),
                        ],
                        ephemeral: true
                    });
                } else {
                    await sendMsg.edit({
                        embeds: [embeds[curPage]],
                        components: [
                            row2,
                            new ActionRowBuilder().addComponents(
                                but1.setDisabled(false),
                                but2.setDisabled(false),
                                but3.setDisabled(false),
                                but4.setDisabled(true),
                                but5.setDisabled(true)
                            ),
                        ],
                        ephemeral: true
                    });
                }
            }
                break;

            case "previous": {
                curPage--;
                if (curPage !== 0) {
                    return sendMsg.edit({
                        embeds: [embeds[curPage]],
                        components: [
                            row2,
                            new ActionRowBuilder().addComponents(
                                but1.setDisabled(false),
                                but2.setDisabled(false),
                                but3.setDisabled(false),
                                but4.setDisabled(false),
                                but5.setDisabled(false)
                            ),
                        ],
                        ephemeral: true
                    });
                } else {
                    sendMsg.edit({
                        embeds: [embeds[curPage]],
                        components: [
                            row2,
                            new ActionRowBuilder().addComponents(
                                but1.setDisabled(true),
                                but2.setDisabled(true),
                                but3.setDisabled(false),
                                but4.setDisabled(false),
                                but5.setDisabled(false)
                            ),
                        ],
                        ephemeral: true
                    });
                }
            }

                break;

            case "first": {
                curPage = 0;
                await sendMsg.edit({
                    embeds: [embeds[curPage]],
                    components: [
                        row2,
                        new ActionRowBuilder().addComponents(
                            but1.setDisabled(true),
                            but2.setDisabled(true),
                            but3.setDisabled(false),
                            but4.setDisabled(false),
                            but5.setDisabled(false)
                        ),
                    ],
                    ephemeral: true
                });
            }

                break;

            case "last": {
                curPage = embeds.length - 1;
                await sendMsg.edit({
                    embeds: [embeds[curPage]],
                    components: [
                        row2,
                        new ActionRowBuilder().addComponents(
                            but1.setDisabled(false),
                            but2.setDisabled(false),
                            but3.setDisabled(false),
                            but4.setDisabled(true),
                            but5.setDisabled(true)
                        ),
                    ],
                    ephemeral: true
                });
            }

                break;

            case "delete": {
                await collector.stop();
            }
        }
    });

    collector2.on("collect", async (i) => {
        if (i.values[0] === "Administration") {
            curPage = 1;

            await i.update({
                embeds: [embeds[1]],
                components: [row2, new ActionRowBuilder().addComponents(but1.setDisabled(true), but2.setDisabled(true), but3, but4.setDisabled(false), but5.setDisabled(false))],
            });
        } else if (i.values[0] === "Diversion") {
            curPage = 2;

            await i.update({
                embeds: [embeds[2]],
                components: [row2, new ActionRowBuilder().addComponents(but1.setDisabled(false), but2.setDisabled(false), but3, but4.setDisabled(false), but5.setDisabled(false))]
            });
        } else if (i.values[0] === "Images") {
            curPage = 3;

            await i.update({
                embeds: [embeds[3]],
                components: [row2, new ActionRowBuilder().addComponents(but1.setDisabled(false), but2.setDisabled(false), but3, but4.setDisabled(false), but5.setDisabled(false))]
            });
        } else if (i.values[0] === "Information") {
            curPage = 4;

            await i.update({
                embeds: [embeds[4]],
                components: [row2, new ActionRowBuilder().addComponents(but1.setDisabled(false), but2.setDisabled(false), but3, but4.setDisabled(false), but5.setDisabled(false))],
            });
        } else if (i.values[0] === "Moderation") {
            curPage = 5;

            await i.update({
                embeds: [embeds[5]],
                components: [row2, new ActionRowBuilder().addComponents(but1.setDisabled(false), but2.setDisabled(false), but3, but4.setDisabled(true), but5.setDisabled(true))],
            });
        }
    });

    collector.on("end", async () => {
        row.components.forEach((btn) => btn.setDisabled(true) && btn.setStyle(ButtonStyle.Secondary));
        row2.components.forEach((select) => select.setDisabled(true));

        if (sendMsg.editable) {
            await sendMsg.edit({
                embeds: [embeds[curPage]],
                components: [row2, row],
            });
        } else {
            console.log("[ERROR] UNABLE TO FIND THE PAGINATION MESSAGE!");
        };
    });
};