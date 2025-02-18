const { EmbedBuilder, MessageFlags } = require("discord.js");
const notAllowMessages = {
    Grifinória: [
        'Alto lá! Você não me parece um grifinório. O que pensa que está fazendo aqui? Se não tiver um bom motivo, chamarei o zelador.',
        'Oh, querido, você está no lugar errado. A Torre da Grifinória é logo ali, mas acho que você está procurando o caminho para a sua própria casa. Tenho certeza de que encontrará o caminho certo se seguir por este corredor.',
        'Não ouse tocar nesse retrato de novo! Você não tem permissão para estar aqui. Se eu o vir por perto outra vez, terá problemas muito sérios. Entendeu?',
        'SEGURANÇA! INTRUSO NA TORRE DA GRIFINÓRIA! ALUNO FORA DE SUA CASA! SOCORRO!',
        'Patético. Acha que pode simplesmente passar por aqui? Volte para o seu dormitório antes que eu decida quem vai levar a culpa pela sua indiscrição. Não me teste.'
    ],
    Corvinal: [
        'Droga! Eu não sou tão inteligente quanto pensei...',
        'O enigma era muito difícil! Acho que preciso estudar mais sobre lógica e enigmas...',
        'Talvez eu devesse pedir ajuda para alguém mais velho... Mas tenho vergonha de parecer burro.',
        'Será que alguém já resolveu esse enigma antes? Preciso ser o primeiro a descobrir a resposta!',
        'Ah, que pena! Bom, pelo menos tentei. Qual será o próximo enigma?',
    ],
    Sonserina: [
        'Droga, fui muito óbvio. Preciso ser mais sutil na próxima vez.',
        'Acho que não fui confiante o bastante. Preciso mostrar mais determinação e presença.',
        'Será que eu deveria ter feito a outra escolha? Talvez eu tenha demonstrado fraqueza.',
        'Preciso aprender a priorizar meus próprios interesses. A lealdade tem limites.',
        'Acho que preciso mostrar mais ambição e desejo de poder. Talvez minha postura não tenha transmitido isso.',
    ],
    LufaLufa: [
        'ARGH! VINAGRE! QUE CHEIRO HORRÍVEL!',
        'Credo, preciso tomar um banho urgente! Minhas roupas vão ficar impregnadas com esse cheiro.',
        'Puxa, eu estava quase conseguindo! Acho que errei o ritmo na última batida.',
        'Sou tão desastrado... Nem para bater num barril direito eu sirvo!',
        'Preciso prestar mais atenção no ritmo. Talvez eu peça para alguém me mostrar de novo'
    ]
}

const ERROR_MESSAGES = {
    NOT_IN_VOICE_CHANNEL: '⚠️ DEVERÁ ESTÁR LIGADO EM UM CANAL DE VOZ ⚠️',
    MOVING: 'Você está se movendo para a próxima sala. Aguarde',
    ROLE_NOT_FOUND: 'Role não encontrada',
};

module.exports = async function (room, interaction, client) {
    if (client.isMoving[interaction.user.id]) {
        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Em movimento').setDescription(ERROR_MESSAGES.MOVING);
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
    }

    client.isMoving[interaction.user.id] = true;

    const guild = interaction.member.guild;
    const member = interaction.member;
    const role = guild.roles.cache.find((role) => role.name === client.roomRoles[room]);

    if (!member.voice.channel) {
        client.isMoving[interaction.user.id] = false;
        await interaction.reply({ content: ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL, flags: MessageFlags.Ephemeral });
        return;
    }

    if (!role) {
        console.log(ERROR_MESSAGES.ROLE_NOT_FOUND);
        client.isMoving[interaction.user.id] = false;
        return;
    }

    let allow = true;
    let neededRole = '';
    for (let roomlist of Object.values(client.roomsList)) {
        const roomElem = roomlist.find(elem => elem.room === room);
        if (roomElem && roomElem.role && !interaction.member.roles.cache.find((role) => role.name === roomElem.role)) {
            allow = false;
            neededRole = roomElem.role;
            break;
        }
    }

    if (allow) {
        try {
            await interaction.member.roles.add(role);
            const currentRole = guild.roles.cache.find((role) => role.name === client.roomRoles[member.voice.channel.name]);
            if (currentRole) {
                await interaction.member.roles.remove(currentRole);
            }

            const channel = guild.channels.cache.find((c) => c.name === room);
            await interaction.member.voice.setChannel(channel);
            console.log(`Usuário ${interaction.member.user.tag} movido para ${channel.name}`);
            await interaction.deferUpdate();
        } catch (error) {
            console.error(`Erro ao mover usuário: ${error}`);
        } finally {
            client.isMoving[interaction.user.id] = false;
        }
    } else {
        client.isMoving[interaction.user.id] = false;
        const embed = new EmbedBuilder().setColor('#ffad00').setDescription(notAllowMessages[neededRole][Math.floor(Math.random() * notAllowMessages[neededRole].length)]);
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};

