const { MessageFlags, EmbedBuilder } = require("discord.js");
const { log } = require("../utils/utils");

const chanellMessageName = "💌correio-do-amor💌"
module.exports = {
	customID: 'modalmensagemdoamor',
	async execute(interaction, client) {
        // await interaction.deferReply({ ephemeral: true }).catch( () => {} );

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

		const message = interaction.fields.getTextInputValue('message');
		const player = client.cache.get("selectcartadoamor_"+interaction.user.id);
        const player_user = guild.members.cache.get(player); // Get the member object from the ID

        if(!player_user) {
            return interaction.reply({ content: 'Usuário não encontrado.', flags: MessageFlags.Ephemeral });
        }

        const CartaAmorChannel = guild.channels.cache.find((c) => c.name === chanellMessageName);
        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('💌 Carta de Amor 💌').setDescription(`❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️

${message}

❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️`).setImage('https://imgur.com/EXOlroC.png');
        
        await CartaAmorChannel.send({content:`Oi <@${player}>, alguem enviou uma carta de amor para você.`, embeds: [embed], ephemeral: false });

log(guild,`<@${player}> recebeu carta de amor.
Mensagem: ${message}`);

        await interaction.reply({ content: 'Mensagem enviada com sucesso!', flags: MessageFlags.Ephemeral });
        
        client.cache.delete("selectcartadoamor_"+interaction.user.id);
    }
}