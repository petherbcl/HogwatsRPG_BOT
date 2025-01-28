const { EmbedBuilder } = require("discord.js");

const room = 'sala-comunal-corvinal'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}