const { EmbedBuilder } = require("discord.js");

const room = 'sala-aula-estudos-dos-trouxas'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}