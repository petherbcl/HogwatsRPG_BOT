const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { RemoveSpecialCharacters } = require("../../utils/utils");

const pericia_by_year = JSON.parse(fs.readFileSync(`./RPGData/pericias_by_year.json`, 'utf8'))
const pericia_list = JSON.parse(fs.readFileSync(`./RPGData/pericias.json`, 'utf8'))

/**
 * Você pode conseguir uma PERÍCIA do seu ano (máximo de 4 compras por ano)
 * 10XP cada perícia
 * Não pode comprar as perícias do ano anterior. São 4 compras por ano e só.
 * As perícias não se acumulam. Se não comprou 4, perde as que sobraram.
 */

module.exports = {
    customID: 'buyPericia',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        
        if(!inv_player.pericia_buy_info){
            inv_player.pericia_buy_info = {}
            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(inv_player, null, 4))
        }
        if(!ficha_player.pericias){
            ficha_player.pericias = []
            fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player, null, 2));
        }

        if(inv_player.pericia_buy_info && inv_player.pericia_buy_info[ficha_player.year] && inv_player.pericia_buy_info[ficha_player.year] >= 4){
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Perícia').setDescription('Você já comprou todas as perícias disponíveis para compra neste ano.').setImage('https://imgur.com/4HUiueO.png');
            return await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});
        }

        if(ficha_player.PE < 10){
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Perícia').setDescription('Você não tem Pontos de Experiência suficientes para comprar uma perícia.').setImage('https://imgur.com/4HUiueO.png');
            return await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});
        }

        let periciasAllow = Object.entries(pericia_by_year)
            .map(([key, value]) => key == ficha_player.year ? value : null)
            .filter(x => x != null)
            .flat()
            .filter(pericia => !ficha_player.pericias.includes(pericia)).sort( (a,b) => pericia_list[a].name.localeCompare(pericia_list[b].name) );

        if(periciasAllow.length == 0){
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Perícia').setDescription('Você já desbloqueou todas as perícias disponíveis para compra.')
            return await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});
        }else{
            
            const selectmenu = new StringSelectMenuBuilder()
                                .setCustomId(`selectbuypericia`)
                                .setPlaceholder('Selecione um Feitiço para desbloquear')
            for(const pericia of periciasAllow){
                selectmenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(pericia_list[pericia].name).setValue(pericia))
            }
            const row = new ActionRowBuilder().addComponents(selectmenu)
    
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Perícia').setDescription('Selecione uma perícia para desbloquear.')
    
            return await interaction.reply({embeds: [embed], components: [row], flags: MessageFlags.Ephemeral});
    
        }
    }
}