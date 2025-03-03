const { EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { log } = require("../../utils/utils");

const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
module.exports = {
    customID: 'selectspell_2',
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const value = interaction.values[0];

        const spell = spell_list[value];

        const embed = new EmbedBuilder()
            .setColor('#ffad00')
            .setTitle(spell.name)
            .setDescription(spell.effect)
            .addFields({ name: 'PM', value: '```'+spell.pm+'```', inline: true },
                { name: 'Custo PE', value: '```'+(spell.custo||0)+'```', inline: true },
                { name: 'Código', value: '`'+value+'`' })
        
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

        log(guild,`<@${user.id}> consultou detalhes do feitiço **${spell.name}** .`);
    }
}