const room = 'cabana-guarda-caças'
const enterRoom = require('../enterRoom.js')
module.exports = {
    customID: room,
    async execute(interaction, client) {
        enterRoom(room, interaction, client)
    }
    
}