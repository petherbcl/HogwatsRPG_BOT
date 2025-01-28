const { EmbedBuilder } = require("discord.js");

const room = 'jardins-de-hogwarts'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}