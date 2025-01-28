const { EmbedBuilder } = require("discord.js");

const room = 'sala-comunal-grifinória'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}