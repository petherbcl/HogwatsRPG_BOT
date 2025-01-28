const { EmbedBuilder } = require("discord.js");

const room = 'cabana-dos-barcos'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}