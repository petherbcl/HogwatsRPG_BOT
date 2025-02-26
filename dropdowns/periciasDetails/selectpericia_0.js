const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

const pericias_list = JSON.parse(fs.readFileSync(`./RPGData/pericias.json`, 'utf8'))
const pericias_by_year = JSON.parse(fs.readFileSync(`./RPGData/pericias_by_year.json`, 'utf8'))

module.exports = {
	customID: 'selectpericia_0',
	async execute(interaction, client) {

		const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

		const value = interaction.values[0];
		const pericia = pericias_list[value];
		const yearKey = Object.keys(pericias_by_year).find(key => pericias_by_year[key].includes(value));

		const embed = new EmbedBuilder()
			.setColor('#ffad00')
			.setTitle(`${pericia.name} - ${yearKey}º ano`)
			.setDescription(`${pericia.description}\n\n**Modificadores**\n${pericia.modificadores}\n\n**Código**\n${"`"+value+"`"}\n\n**Requisitos**\n${pericia.requisitos.map(r => "`"+pericias_list[r].name+"`").join(', ')}`)

		await interaction.reply({embeds: [embed], ephemeral: true});
    }
}