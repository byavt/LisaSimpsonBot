const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");
const {
    Snake,
    Minesweeper,
    Connect4,
    RockPaperScissors,
    Hangman,
    TwoZeroFourEight,
    Trivia,
} = require("discord-gamecord");
const Reply = require("../../Systems/Reply");
const Words = [
    "Veredicto",
    "Camilla",
    "Gobierno",
    "Baile",
    "Abrazadera",
    "Zanahoria",
    "Taza",
    "Medias",
    "Alarmar",
];
const RandomWord = Words[Math.floor(Math.random() * Words.length)];

module.exports = {
    name: "diversión",
    description: "Comandos de diversión / juegos / acciones.",
    Category: "Fun",
    options: [{
        name: "mini-juegos",
        description: "Juega a juegos.",
        type: 2,
        options: [{
            name: "snake",
            description: "Juega al juego de la serpiente.",
            type: 1,
        },
        {
            name: "buscaminas",
            description: "Juega al juego del busca minas.",
            type: 1,
        },
        {
            name: "conecta4",
            description: "Juega al juego del conecta 4.",
            type: 1,
            options: [{
                name: "oponente",
                description: "El oponente.",
                type: 6,
                required: true,
            },],
        },
        {
            name: "piedrapapeltijera",
            description: "Juega al juego de piedra papel o tijera",
            type: 1,
            options: [{
                name: "oponente",
                description: "El oponente.",
                type: 6,
                required: true,
            },],
        },
        {
            name: "ahorcado",
            description: "Juega al juego del ahorcado.",
            type: 1,
        },
        {
            name: "2048",
            description: "Juega al juego 2048.",
            type: 1,
        },
        {
            name: "trivia",
            description: "Haz un trivia.",
            type: 1,
        },
        ]
    },
    {
        name: "reacciones",
        description: "Reacciones SFW.",
        type: 2,
        options: [{
            name: "guantazo",
            description: "Dale un tortazo a alguien.",
            type: 1,
            options: [{
                name: "usuario",
                description: "El usuario a pegar.",
                type: 6,
                required: true
            }],
        },],
    },
    ],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {
            options
        } = interaction;

        const SubCommandGroup = options.getSubcommandGroup(false);

        switch (SubCommandGroup) {
            case "juegos": {
                const SubCommand = options.getSubcommand(false);

                switch (SubCommand) {
                    case "mini-juegos": {
                        const Game = new Snake({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: "Juego de la Serpiente",
                                overTitle: "Has perdido.",
                                color: "#5865F2",
                            },
                            emojis: {
                                board: "⬛",
                                food: "🍎",
                                up: "⬆️",
                                down: "⬇️",
                                left: "⬅️",
                                right: "➡️",
                            },
                            stopButton: "Parar",
                            timeoutTime: 60000,
                            snake: {
                                head: "🟢",
                                body: "🟩",
                                tail: "🟢",
                                over: "💀",
                            },
                            foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
                            playerOnlyMessage: "Solo {player} puede usar esos botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result);
                        });
                    }
                        break;
                    case "buscaminas": {
                        const Game = new Minesweeper({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: "Buscaminas",
                                color: "#5865F2",
                                description: "Haga clic en los botones para revelar los bloques excepto las minas.",
                            },
                            emojis: {
                                flag: "🚩",
                                mine: "💣",
                            },
                            mines: 5,
                            timeoutTime: 60000,
                            winMessage: "¡Ganaste el juego! Has evitado con éxito todas las minas.",
                            loseMessage: "¡Perdiste el juego! Cuidado con las minas la próxima vez.",
                            playerOnlyMessage: "Solo {player} puede usar estos botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result);
                        });
                    }
                        break;
                    case "conecta4": {
                        const Oponente = options.getUser("oponente");

                        const Game = new Connect4({
                            message: interaction,
                            isSlashGame: true,
                            opponent: Oponente,
                            embed: {
                                title: "Conecta 4",
                                statusTitle: "Estado:",
                                color: "#5865F2",
                            },
                            emojis: {
                                board: "⚪",
                                player1: "🔴",
                                player2: "🟡",
                            },
                            timeoutTime: 60000,
                            buttonStyle: "Primary",
                            turnMessage: "{emoji} | Es el turno de **{player}**.",
                            winMessage: "{emoji} | **{player}** ha ganado el juego!",
                            tieMessage: "¡El Juego empató! ¡Nadie ganó el Juego!",
                            timeoutMessage: "¡El Juego quedó inconcluso! ¡Nadie ganó el Juego!",
                            playerOnlyMessage: "Solo {player} y {opponent} pueden usar los botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result); // =>  { result... }
                        });
                    }
                        break;
                    case "piedrapapeltijera": {
                        const Oponente = options.getUser("oponente");

                        const Game = new RockPaperScissors({
                            message: interaction,
                            isSlashGame: true,
                            opponent: Oponente,
                            embed: {
                                title: "Piedra Papel o Tijera",
                                color: "#5865F2",
                                description: "Presione un botón a continuación para hacer una elección.",
                            },
                            buttons: {
                                rock: "Piedra",
                                paper: "Papel",
                                scissors: "Tijera",
                            },
                            emojis: {
                                rock: "🌑",
                                paper: "📰",
                                scissors: "✂️",
                            },
                            timeoutTime: 60000,
                            buttonStyle: "PRIMARY",
                            pickMessage: "Has escogido {emoji}.",
                            winMessage: "**{player}** ha ganado el juego! ¡Felicidades!",
                            tieMessage: "¡El Juego empató! ¡Nadie ganó el Juego!",
                            timeoutMessage: "¡El Juego quedó inconcluso! ¡Nadie ganó el Juego!",
                            playerOnlyMessage: "Solo {player} y {opponent} pueden usar los botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result); // =>  { result... }
                        });
                    }
                        break;
                    case "ahorcado": {
                        const Game = new Hangman({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: "Ahorcado",
                                color: "#5865F2",
                            },
                            hangman: {
                                hat: "🎩",
                                head: "😟",
                                shirt: "👕",
                                pants: "🩳",
                                boots: "👞👞",
                            },
                            customWord: RandomWord,
                            timeoutTime: 60000,
                            theme: "nature",
                            winMessage: "Has ganado! La palabra era **{word}**.",
                            loseMessage: "Has perdido! La palabra era **{word}**.",
                            playerOnlyMessage: "Solo {player} puede utilizar estos botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result); // =>  { result... }
                        });
                    }
                        break;
                    case "2048": {
                        const Game = new TwoZeroFourEight({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: "2048",
                                color: "#5865F2",
                            },
                            emojis: {
                                up: "⬆️",
                                down: "⬇️",
                                left: "⬅️",
                                right: "➡️",
                            },
                            timeoutTime: 60000,
                            buttonStyle: "Primary",
                            playerOnlyMessage: "Solo {player} puede usar estos botones.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result);
                        });
                    }
                        break;
                    case "trivia": {
                        const Game = new Trivia({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: "Trivia",
                                color: "#5865F2",
                                description: "Tienes 60 segundos para adivinar la respuesta.",
                            },
                            timeoutTime: 60000,
                            buttonStyle: "Primary",
                            trueButtonStyle: "Success",
                            falseButtonStyle: "Danger",
                            mode: "multiple", // multiple || single
                            difficulty: "medium", // easy || medium || hard
                            winMessage: "Has ganado! La opcion correcta es {answer}.",
                            loseMessage: "Has perdido!  La respuesta correcta es {answer}.",
                            errMessage: "¡No se pueden obtener los datos de la pregunta! Inténtalo de nuevo.",
                            playerOnlyMessage: "Solo {player} puede usar este comando.",
                        });

                        Game.startGame();
                        Game.on("gameOver", (result) => {
                            console.log(result);
                        });
                    }
                        break;
                }

            }
                break;
            case "guantazo": {
                const Sub = options.getSubcommand(false);

                switch (Sub) {
                    case "slap": {
                        const Usuario = options.getUser("usuario");

                        if (Usuario.id === user.id)
                            return Reply(interaction, process.env.Cross, "No puedes pegarte a ti mismo!", true);

                        let {
                            body
                        } = await superagent.get("https://purrbot.site/api/img/sfw/slap/gif");

                        await interaction.deferReply();

                        const Embed = new EmbedBuilder()
                            .setAuthor({
                                name: `${user.username} pegó a ${Usuario.username}`,
                                iconURL: Usuario.displayAvatarURL()
                            })
                            .setColor(client.color)
                            .setDescription(`${user} ha pegado ha ${Usuario}! **Ojo se viene pelea!!!**`)
                            .setImage(body.link)
                            .setTimestamp();

                        interaction.editReply({
                            embeds: [Embed]
                        });
                    }
                        break;
                }
            }
        }
    },
};