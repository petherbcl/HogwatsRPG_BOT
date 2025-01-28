const { EmbedBuilder } = require("discord.js");

const room = 'corredor-piso-7'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}