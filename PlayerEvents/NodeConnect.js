const { Client } = require("discord.js");
const { Node } = require("erela.js");
const { blue } = require("chalk");

module.exports = {
    name: "nodeConnect",
    /**
     * 
     * @param {Node} node 
     * @param {Client} client 
     */
    async execute(node, client) {
        console.log(blue(`Node ${node.options.identifier} conectado!`));
    },
};