const { EmbedBuilder } = require("discord.js");

const room = 'sala-aula-trato-criaturas-mágicas'
const enterRoom = require('../enterRoom.js')
module.exports = {
	customID: room,
	async execute(interaction, client) {
        enterRoom(room, interaction, client)
	}
    
}