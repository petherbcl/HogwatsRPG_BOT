const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { RemoveSpecialCharacters } = require("../../utils/utils");

const spell_by_year = JSON.parse(fs.readFileSync(`./RPGData/spell_by_year.json`, 'utf8'))
const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))

/**
 * só pode comprar feitiços do ano atual ou anterior
 * 5XP cada magia
 */

module.exports = {
    customID: 'buySpell',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8'))
        
        const spellsAllow = Object.entries(spell_by_year)
            .map(([key, value]) => key <= ficha_player.year ? value : null)
            .filter(x => x != null)
            .flat()
            .filter(spell => !ficha_player.spells.includes(spell))
            .sort( (a,b) => spell_list[a].name.localeCompare(spell_list[b].name) );

        if(spellsAllow.length == 0){
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Feitiços').setDescription('Você já desbloqueou todos os feitiços disponíveis para compra.')
            return await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});
        }else{
            const selectNeed = Math.ceil(spellsAllow.length/25)
            const rowList = []; 
            for(let i = 0; i < selectNeed; i++){
                const row = new ActionRowBuilder()
                const selectmenu = new StringSelectMenuBuilder()
                                    .setCustomId(`selectbuyspell_${i}`)
                                    .setPlaceholder('Selecione um Feitiço para desbloquear')
                const spells_slice = spellsAllow.slice(i*25, (i+1)*25)
                for(const spell of spells_slice){
                    selectmenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(spell_list[spell].name).setValue(spell))
                }
                row.addComponents(selectmenu)
                rowList.push(row)
            }
    
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Feitiços').setDescription('Selecione um feitiço para desbloquear.')
    
            return await interaction.reply({embeds: [embed], components: rowList, flags: MessageFlags.Ephemeral});
    
        }
    }
}