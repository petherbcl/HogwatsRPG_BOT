const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const { RemoveSpecialCharacters } = require("../../utils/utils");

const pericia_by_year = JSON.parse(fs.readFileSync(`./RPGData/pericias_by_year.json`, 'utf8'))
const pericia_list = JSON.parse(fs.readFileSync(`./RPGData/pericias.json`, 'utf8'))

/**
 * Você pode aumentar UM PONTO em UM ATRIBUTO por 10 XP (máximo de 4 compras)
 * 10XP cada ATRIBUTO
 * Não pode comprar as perícias do ano anterior. São 4 compras por ano e só.
 * As perícias não se acumulam. Se não comprou 4, perde as que sobraram.
 */

module.exports = {
    customID: 'buyAtributo',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        
        if(inv_player.atributobuy && inv_player.atributobuy >= 4){
            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Atributo').setDescription('Você já comprou o máximo de atributos permitidos.').setImage('https://imgur.com/4HUiueO.png');
            return await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});
        }

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`selectbuyatributo`)
                .setPlaceholder('Selecione um Atributo')
                .addOptions(new StringSelectMenuOptionBuilder().setLabel('Força').setValue('F'))
                .addOptions(new StringSelectMenuOptionBuilder().setLabel('Habilidade').setValue('H'))
                .addOptions(new StringSelectMenuOptionBuilder().setLabel('Resistência').setValue('R'))
                .addOptions(new StringSelectMenuOptionBuilder().setLabel('Armadura').setValue('A'))
                .addOptions(new StringSelectMenuOptionBuilder().setLabel('Poder de Fogo').setValue('PdF'))
        )

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Atributos').setDescription('Selecione um Atributo a aumentar.')
        
        return await interaction.reply({embeds: [embed], components: [row], flags: MessageFlags.Ephemeral});        
    }
}