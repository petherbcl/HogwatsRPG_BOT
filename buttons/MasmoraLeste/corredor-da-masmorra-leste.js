const { EmbedBuilder } = require("discord.js");

const room = 'corredor-da-masmorra-leste'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}