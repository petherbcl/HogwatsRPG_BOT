const { EmbedBuilder } = require("discord.js");

const room = 'banheiro-da-murta-que-geme'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}