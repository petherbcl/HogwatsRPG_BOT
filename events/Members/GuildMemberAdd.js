const { Events, EmbedBuilder } = require("discord.js");
const fs = require('fs');
const { RemoveSpecialCharacters } = require("../../utils/utils");

async function startMessageCartaHogwarts(guild,user) {
    const CartaChannel = guild.channels.cache.find((c) => c.name === 'carta-de-hogwarts');

    const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Carta de Hogwats').setDescription(`Bem-vindo a Hogwarts, jovem bruxo ou bruxa!

Enquanto diretoção desta ilustre escola de magia e bruxaria, é com grande prazer que o recebo em nossa comunidade.

Para que possa iniciar sua jornada mágica, por favor, envie sua ficha de personagem completa no canal <#${CartaChannel.id}> para que possamos integrá-lo(a) ao nosso mundo.

Que a sua passagem por Hogwarts seja repleta de aventuras e aprendizado!

Com os melhores cumprimentos,
Direção de Hogwarts
🦉✨`);

    await user.send({ embeds: [embed], ephemeral: true });
}

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        await member.guild.roles.fetch(); // Força o carregamento da cache
        const role = member.guild.roles.cache.find((role) => {
            return role.name === client.roomRoles["carta-de-hogwarts"]
        });

        if (role) {
            member.roles
                .add(role)
                .then(async () =>{
                        console.log(`Role ${role.name} atribuída a ${member.user.tag}`)
                        await startMessageCartaHogwarts(member.guild, member.user)
                    }
                )
                .catch((err) => console.error(`Erro ao atribuir role: ${err}`));

            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`,
                            JSON.stringify({inventario:{}}), (err) => {
                                if (err) {
                                    console.error('Erro ao criar o arquivo inventário:', err);
                                } else {
                                    console.log('Arquivo inventário criado com sucesso!');
                                }
                            }
                        );
        } else {
            console.log("Role não encontrada");
        }


    },
};
