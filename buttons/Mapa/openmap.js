const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

const rolesAllow = {
    "DM": 'https://imgur.com/h0prte8.png',
    "Corvinal" : 'https://imgur.com/inHupHI.png',
    "Grifinória": 'https://imgur.com/gW9xzBe.png',
    "LufaLufa": 'https://imgur.com/9QVwcPt.png',
    "Sonserina": 'https://imgur.com/UWL66ij.png',
}
const defaultImage = 'https://imgur.com/81jvfm5.png'

module.exports = {
	customID: 'openmap',
	async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let map = defaultImage
        for(const [role, image] of Object.entries(rolesAllow)){
            if(member.roles.cache.find((r) => r.name === role)){
                map = image
                continue
            }
        }

        const embed = new EmbedBuilder().setColor('#ffad00').setImage(map)
        await interaction.reply({ embeds: [embed], ephemeral: true });
	}
}