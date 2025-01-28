const { EmbedBuilder } = require("discord.js");

const room = 'campo-quadribol'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}