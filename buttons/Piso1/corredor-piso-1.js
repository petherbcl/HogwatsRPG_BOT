const { EmbedBuilder } = require("discord.js");

const room = 'corredor-piso-1'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}