const { EmbedBuilder } = require("discord.js");

const room = 'grande-escadaria-14'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}