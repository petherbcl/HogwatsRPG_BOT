const { EmbedBuilder } = require("discord.js");

const room = 'torre-das-corujas'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}