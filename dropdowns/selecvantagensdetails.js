const { EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { log } = require("../utils/utils");

const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

module.exports = {
    customID: 'selecvantagensdetails',
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const value = interaction.values[0];
        const vantagem = vantagem_list[value];

        const embed = new EmbedBuilder()
            .setColor('#ffad00')
            .setTitle(vantagem.label)
            .setDescription(vantagem.effect)
            .addFields({ name: 'Custo', value: '```'+`${vantagem.custo} PE`+'```', inline: true },
                { name: 'Bonus', value: '```'+vantagem.bonus+'```', inline: true },
                { name: 'Código', value: '`'+value+'`' })
        
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

        log(guild,`<@${user.id}> usou comando ${"`/vantagem`"} para consultar a vantagem **${vantagem.label}** .`);
    }
}