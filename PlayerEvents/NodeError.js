const { Client } = require("discord.js");
const { Node } = require("erela.js");
const { red } = require("chalk");
const { message } = Error();

module.exports = {
    name: "nodeError",
    /**
     * 
     * @param {Node} node 
     * @param {Client} client 
     */
    async execute(node, client) {
        console.log(red(`Node ${node.options.identifier} dio un error con el codigo ${message.toString()}`));
    },
};