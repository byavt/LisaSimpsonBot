const { Client, Partials, Collection } = require("discord.js");
const ms = require("ms");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
require("dotenv").config();
const {
    Channel,
    GuildMember,
    Message,
    Reaction,
    ThreadMember,
    User,
    GuildScheduledEvent,
} = Partials;

const client = new Client({
    intents: 131071,
    partials: [
        Channel,
        GuildMember,
        Message,
        Reaction,
        ThreadMember,
        User,
        GuildScheduledEvent,
    ],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms("1m") },
});

client.commands = new Collection();
client.color = "#FFF700";

const nodes = require("../Systems/Nodes");
const { Manager } = require("erela.js");
const { default: Spotify } = require("better-erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Tidal = require("erela.js-tidal");
const AppleMusic = require("better-erela.js-apple").default;
const Facebook = require("erela.js-facebook");

client.player = new Manager({
    nodes: nodes,
    plugins: [
        new Spotify({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        }),
        new Facebook(),
        new Deezer(),
        new AppleMusic(),
    ],
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id);

        if (guild) guild.shard.send(payload);
    },
});

client.on("raw", async (d) => client.player.updateVoiceState(d));

const Handlers = ["Events", "Errors", "Commands", "Player", "ClientVariables", "EventStack"];

Handlers.forEach((handler) => {
    require(`./Handlers/${handler}`)(client, PG, Ascii);
});

module.exports = client;

client.login(process.env.DISCORD_TOKEN);
