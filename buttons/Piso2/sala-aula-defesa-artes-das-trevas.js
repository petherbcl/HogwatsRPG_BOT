const { EmbedBuilder } = require("discord.js");

const room = 'sala-aula-defesa-artes-das-trevas'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}