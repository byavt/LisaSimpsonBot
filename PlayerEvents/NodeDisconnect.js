const { Client } = require("discord.js");
const { Node } = require("erela.js");
const { red } = require("chalk");

module.exports = {
    name: "nodeDisconnect",
    /**
     * 
     * @param {Node} node 
     * @param {Client} client 
     */
    async execute(node, client) {
        console.log(red(`Node ${node.options.identifier} desconectado`));
    },
};