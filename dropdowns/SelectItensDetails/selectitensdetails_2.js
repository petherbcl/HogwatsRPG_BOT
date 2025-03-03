const { EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { log } = require("../../utils/utils");

const item_list = JSON.parse(fs.readFileSync(`./RPGData/item_list.json`, 'utf8'))
module.exports = {
    customID: 'selectitensdetails_2',
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const value = interaction.values[0];

        const item = item_list[value];

        const embed = new EmbedBuilder()
            .setColor('#ffad00')
            .setTitle(item.name)
            .setDescription(item.description)
            .addFields({ name: 'Valor', value: '```'+`${item.price} $G`+'```', inline: true },
                { name: 'Tipo', value: '```'+(item.type||' ')+'```', inline: true },
                { name: 'Código', value: '`'+value+'`' })
        
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

        log(guild,`<@${user.id}> consultou detalhes do item **${item.name}** .`);
    }
}