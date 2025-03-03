const { EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { log } = require("../utils/utils");

const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))

module.exports = {
    customID: 'selectdesvantagensdetails',
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const value = interaction.values[0];
        const desvantagem = desvantagem_list[value];

        const embed = new EmbedBuilder()
            .setColor('#ffad00')
            .setTitle(desvantagem.label)
            .setDescription(desvantagem.effect)
            .addFields({ name: 'Custo', value: '```'+`${desvantagem.custo} PE`+'```', inline: true },
                { name: 'Bonus', value: '```'+desvantagem.bonus+'```', inline: true },
                { name: 'Código', value: '`'+value+'`' })
        
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

        log(guild,`<@${user.id}> usou comando ${"`/desvantagem`"} para consultar a desvantagem **${desvantagem.label}** .`);
    }
}