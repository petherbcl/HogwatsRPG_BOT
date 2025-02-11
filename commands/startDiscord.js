const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs');
const { RemoveSpecialCharacters } = require("../utils/utils");

async function createRpgRoles(client, guild) {
 
    console.warn('  STARTING ROLES CREATION');
    for (const roleInfo of client.rpgRoles) {
        let role = guild.roles.cache.find(r => r.name === roleInfo.name);
        if (!role) {
            await guild.roles.create({
                name: roleInfo.name,
                color: roleInfo.color,
                permissions: new PermissionsBitField(0n)
            })
                .then(() => {
                    console.warn(`      role created: "${roleInfo.name}"`);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.log(`       Role "${roleInfo.name}" already exists.`);
        }
    }
    console.warn('  FINISHING ROLES CREATION');
}

async function createStructure(client, guild) {

    console.warn('  STARTING STRUCTURE CREATION');
    for (let category of client.structure) {
        let categoryChannel = guild.channels.cache.find((c) => c.name === category.name && c.type === 4);
        if (!categoryChannel) {
            categoryChannel = await guild.channels.create({ name: category.name, type: 4 });
            console.warn(`      Category ${categoryChannel.name} created.`);
        }

        for (const channel of category.channels) {
            channel.name = channel.name.toLowerCase().replaceAll(' ', '-');
            for (const role of channel.permissions) {
                if(client.roomRoles[channel.name]){
                    let channelRole = guild.roles.cache.find(r => r.name === client.roomRoles[channel.name]);
                    if (!channelRole) {
                        channelRole = await guild.roles.create({
                            name: client.roomRoles[channel.name],
                            color: role.color,
                            permissions: new PermissionsBitField()
                        });
                        console.warn(`          Role ${channelRole.name} created under channel ${channel.name}.`);
                    }
                }else{
                    console.warn(`          Channel ${channel.name} does not have roles.`);
                }
                
            }

            let catChannel = guild.channels.cache.find((c) => c.name === channel.name && c.type === channel.type);
            if (!catChannel) {
                catChannel = await guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: categoryChannel.id,
                    permissionOverwrites: channel.permissions.map((role) => ({
                        id: guild.roles.cache.find((r) => r.name === (client.roomRoles[channel.name] || '@everyone')).id,
                        allow: role.allow.map((p) => PermissionsBitField.Flags[p]),
                        deny: role.deny.map((p) => PermissionsBitField.Flags[p]),
                    }))
                });
                console.warn(`          Channel ${catChannel.name} created under category ${categoryChannel.name}.`);

                if (catChannel.type === 2 && channel.hasPassage) {
                    const button = new ButtonBuilder()
                        .setCustomId('openRoomPassage')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Ver Passagens');
                    const row = new ActionRowBuilder().addComponents(button);

                    await catChannel.send({
                        components: [row]
                    });
                }
            }
        }
    }
    console.warn('  FINISHING STRUCTURE CREATION');
}

async function setupExpressoChannel(guild) {
    const ExpressoChannel = guild.channels.cache.find((c) => c.name === 'expresso-de-hogwarts');

    const fetchedMessages = await ExpressoChannel.messages.fetch({ limit: 100 });
    await ExpressoChannel.bulkDelete(fetchedMessages, true);

    const button = new ButtonBuilder().setCustomId('newArrival').setStyle(ButtonStyle.Primary).setLabel('Entrar em Hogwarts');
    const row = new ActionRowBuilder().addComponents(button);
    const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Expresso de Hogwarts').setDescription(`Caros novos alunos de Hogwarts,

É com grande alegria que damos as boas-vindas à Escola de Magia e Bruxaria de Hogwarts! 🌟

Ao cruzarem os portões deste castelo milenar, preparem-se para um ano repleto de descobertas, desafios e, acima de tudo, magia. Aqui, cada sala guarda segredos e cada corredor conta histórias há muito tempo esquecidas.

Logo serão divididos nas vossas Casas — Grifinória, Sonserina, Corvinal ou Lufa-Lufa — onde farão amizades que durarão para toda a vida e contribuirão para a vossa família em Hogwarts. Lembrem-se: a vossa Casa é o vosso lar dentro do castelo.

Preparem as varinhas, memorizem os feitiços e nunca se esqueçam:
"A felicidade pode ser encontrada mesmo nas horas mais sombrias, se nos lembrarmos de acender a luz."

Estamos muito felizes por terem escolhido embarcar nesta jornada mágica connosco! Que este ano letivo seja brilhante, encantador e inesquecível.

Com os melhores cumprimentos,
Direção de Hogwarts
🦉✨`);
    await ExpressoChannel.send({ embeds: [embed], components: [row], ephemeral: false });
}

async function startMessageCartaHogwarts(guild) {

    const CartaChannel = guild.channels.cache.find((c) => c.name === 'carta-de-hogwarts');
    const fetchedMessages = await CartaChannel.messages.fetch({ limit: 100 });
    await CartaChannel.bulkDelete(fetchedMessages, true);

    const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Carta de Hogwats').setDescription(`Bem-vindo a Hogwarts, jovem bruxo ou bruxa!

Enquanto direção desta ilustre escola de magia e bruxaria, é com grande prazer que o recebo em nossa comunidade.

Para que possa iniciar sua jornada mágica, por favor, envie sua ficha de personagem completa para que possamos integrá-lo(a) ao nosso mundo.

Que a sua passagem por Hogwarts seja repleta de aventuras e aprendizado!

Com os melhores cumprimentos,
Direção de Hogwarts
🦉✨`).setImage('https://imgur.com/g0NU8LS.png');;

    const button = new ButtonBuilder().setCustomId('sendNewLetter').setStyle(ButtonStyle.Primary).setLabel('Enviar Carta');
    const row = new ActionRowBuilder().addComponents(button);

    await CartaChannel.send({ embeds: [embed], components: [row], ephemeral: false });
}

async function startMapaHogwarts(guild) {

    const MapaChannel = guild.channels.cache.find((c) => c.name === 'consultar-mapa');
    const fetchedMessages = await MapaChannel.messages.fetch({ limit: 100 });
    await MapaChannel.bulkDelete(fetchedMessages, true);

    const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Mapa de Hogwarts').setDescription(`Consulte o mapa de Hogwarts para encontrar salas, corredores e passagens secretas. 🗺️`)

    const button = new ButtonBuilder().setCustomId('openmap').setStyle(ButtonStyle.Primary).setLabel('Abrir Mapa');
    const row = new ActionRowBuilder().addComponents(button);

    await MapaChannel.send({ embeds: [embed], components: [row], ephemeral: false });
}

async function manageBecoDiagonal(guild) {

    // Banco Gringotes
    const bancogringoteschannel = guild.channels.cache.find((c) => c.name === 'banco-gringotes');
    let fetchedMessages = await bancogringoteschannel.messages.fetch({ limit: 100 });
    await bancogringoteschannel.bulkDelete(fetchedMessages, true);

    let embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/1apZAo4.png');
    let embed = new EmbedBuilder().setColor('#ffad00').setTitle('Banco Gringotes').setDescription(`*Bem-vindo ao Banco Gringotes, o mais seguro e prestigiado banco do mundo bruxo!*

Administrado por duendes há séculos, Gringotes é o local ideal para guardar seus galeões, sicles e nuques, além de proteger seus tesouros mais valiosos. Nossas abóbadas subterrâneas são encantadas com as magias mais poderosas para garantir que apenas o legítimo proprietário tenha acesso.

Lembre-se: qualquer tentativa de invasão ou comportamento inadequado será punida... severamente.

Confie em Gringotes, onde sua fortuna está sempre em mãos (ou garras) seguras.
*Desejamos-lhe um dia mágico e próspero!*`)
    let embed2 = new EmbedBuilder().setColor('#ffad00').setDescription(`Ao clicar no botão abaixo um dados D6 será lançado e multiplicado por 100 para calcular o valor em galões que irá ganhar (1D6 x 100) `)
    let button = new ButtonBuilder().setCustomId('gringotsLevantar').setStyle(ButtonStyle.Primary).setLabel('Levantar Galeões');
    let row = new ActionRowBuilder().addComponents(button);

    await bancogringoteschannel.send({ embeds: [embedImg,embed,embed2], components: [row], ephemeral: false });

    // Floreios e Borrões
    const floreioseborroeschannel = guild.channels.cache.find((c) => c.name === 'floreios-e-borrões');
    fetchedMessages = await floreioseborroeschannel.messages.fetch({ limit: 100 });
    await floreioseborroeschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/O6PfpGh.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle('Floreios e Borrões').setDescription(`Aqui, a magia das palavras ganha vida!

Seja para encontrar aquele grimório raro, um clássico das histórias mágicas ou o mais recente guia de poções, temos exatamente o que precisa para enriquecer os seus estudos e aventuras.

Entre e explore! As melhores histórias começam com um bom livro. 🪄`);
    button = new ButtonBuilder().setCustomId('floreioseborroesCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Livros 1º ano - 8$G');
    row = new ActionRowBuilder().addComponents(button);
    await floreioseborroeschannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });

    // Madame Malkin - Roupas para Todas as Ocasiões
    const madamemalkinschannel = guild.channels.cache.find((c) => c.name === 'madame-malkins-roupas-para-todas-as-ocasioes');
    fetchedMessages = await madamemalkinschannel.messages.fetch({ limit: 100 });
    await madamemalkinschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/cG2Zbck.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle('Madame Malkin - Roupas para Todas as Ocasiões').setDescription(`🧙‍♂️ Bem-vindo à Madame Malkin - Roupas para Todas as Ocasiões!

Seja você um jovem bruxo adquirindo seu primeiro uniforme de Hogwarts ou um mago experiente em busca de vestes elegantes para um evento especial, aqui encontrará o que precisa. Nossas vestes são confeccionadas com tecidos encantados da mais alta qualidade e personalizadas para garantir conforto e estilo, seja para o dia a dia ou ocasiões memoráveis.

Entre, experimente e deixe que a magia do tecido trabalhe a seu favor! ✨

Se precisar de ajuda, nossa equipe estará encantada em atender. 🪄`);
    button = new ButtonBuilder().setCustomId('madamemalkinsCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Roupas 1º ano  - 6$G');
    row = new ActionRowBuilder().addComponents(button);
    await madamemalkinschannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });

    // Olivaras
    //Varinha mágica: Essencial para a prática de feitiços. As varinhas são personalizadas para cada bruxo e podem ser adquiridas na Olivaras, renomada loja de varinhas.
    const olivaraschannel = guild.channels.cache.find((c) => c.name === 'olivaras');
    fetchedMessages = await olivaraschannel.messages.fetch({ limit: 100 });
    await olivaraschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/TuwOqmH.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle('Olivaras - Fabricantes de Varinhas de Qualidade Desde 382 a.C.').setDescription(`🧙‍♂️ Bem-vindo à Olivaras - Fabricantes de Varinhas de Qualidade Desde 382 a.C.!

Aqui, onde a magia encontra o artesanato, ajudaremos você a encontrar a varinha que o escolherá. Cada varinha é única, fabricada com materiais raros e núcleos mágicos poderosos, perfeitos para canalizar sua magia com excelência.

Explore as prateleiras, sinta a energia das varinhas ao seu redor e lembre-se: a varinha escolhe o bruxo. ✨

Que esta seja a primeira de muitas aventuras mágicas! Se precisar de orientação, estou à disposição. 🪄`);
    button = new ButtonBuilder().setCustomId('olivarasCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Varinha  - 1$G');
    row = new ActionRowBuilder().addComponents(button);
    await olivaraschannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });

    // Caldeirões de Potage
    //Caldeirão (estanho, tamanho padrão 2): Utilizado nas aulas de Poções. Disponível na Loja de Caldeirões de Potage.
    const caldeiroesdepotagechannel = guild.channels.cache.find((c) => c.name === 'loja-de-caldeiroes-de-potage');
    fetchedMessages = await caldeiroesdepotagechannel.messages.fetch({ limit: 100 });
    await caldeiroesdepotagechannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/XkIyjCK.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle('Caldeirões de Potage - Caldeirões de Qualidade para Todas as Poções').setDescription(`🧙‍♂️ Bem-vindo à Caldeirões de Potage - Caldeirões de Qualidade para Todas as Poções!

Aqui encontrará caldeirões perfeitos para cada necessidade mágica: de estanho, bronze, cobre ou prata; tamanhos padrão ou autoagitantes, todos prontos para transformar seus ingredientes em poções poderosas.

Seja você um estudante iniciando as aulas de Poções ou um mestre alquimista em busca de excelência, temos o caldeirão ideal para o seu talento.

Escolha com cuidado, pois a magia começa no recipiente certo! Se precisar de ajuda, nossa equipe estará pronta para auxiliar. 🪄`);
    button = new ButtonBuilder().setCustomId('caldeiroesdepotageCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Caldeirão  - 1$G');
    row = new ActionRowBuilder().addComponents(button);
    await caldeiroesdepotagechannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });
    
    // Boticário Slug & Jiggers
    //Conjunto de frascos: Para armazenar ingredientes e poções. Podem ser encontrados no Boticário Slug & Jiggers.
    const boticarioslugjiggerschannel = guild.channels.cache.find((c) => c.name === 'boticario-slug-e-jiggers');
    fetchedMessages = await boticarioslugjiggerschannel.messages.fetch({ limit: 100 });
    await boticarioslugjiggerschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/2Wah9DI.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle('Boticário Slug & Jiggers - Ingredientes Mágicos para Poções Perfeitas').setDescription(`🧙‍♂️ Bem-vindo ao Boticário Slug & Jiggers - Ingredientes Mágicos para Poções Perfeitas!

Aqui encontrará tudo o que precisa para preparar desde poções simples até elixires complexos. Dos mais raros ingredientes, como olhos de tritão e raiz de asfódelo, aos básicos como bezoares e asas de morcego, nossa seleção é de qualidade incomparável.

Misture, crie e explore os limites da alquimia! Se precisar de ajuda para encontrar um ingrediente específico ou orientação para sua próxima criação mágica, estamos à disposição.

Sua jornada na arte das poções começa aqui! 🪄✨`);
    button = new ButtonBuilder().setCustomId('boticarioslugjiggersCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Frascos Vazios  - 1$G');
    row = new ActionRowBuilder().addComponents(button);
    await boticarioslugjiggerschannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });

    // Wiseacre's Wizarding Equipment
    //Telescópio: Necessário para as aulas de Astronomia. Disponível na Wiseacre's Wizarding Equipment.
    //Balança de latão: Usada para pesar ingredientes em Poções. Também encontrada na Wiseacre's Wizarding Equipment.
    const wiseacreswizardingwquipmentchannel = guild.channels.cache.find((c) => c.name === 'wiseacres-wizarding-equipment');
    fetchedMessages = await wiseacreswizardingwquipmentchannel.messages.fetch({ limit: 100 });
    await wiseacreswizardingwquipmentchannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/H9BJ7Nt.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle(`Wiseacre's Wizarding Equipment - Equipamentos Mágicos de Confiança para Todos os Feiticeiros`).setDescription(`🧙‍♂️ Bem-vindo à Wiseacre's Wizarding Equipment - Equipamentos Mágicos de Confiança para Todos os Feiticeiros!

Aqui encontrará os itens essenciais para sua jornada mágica: telescópios encantados, globos celestes, ampulhetas de areia temporal, e muito mais! Seja para estudos em Hogwarts, viagens mágicas ou explorações arcanas, nossos equipamentos combinam funcionalidade e um toque de elegância.

Descubra o que precisa para tornar sua magia ainda mais incrível! Se tiver dúvidas ou precisar de assistência, ficaremos encantados em ajudar. ✨

Prepare-se para transformar o ordinário em extraordinário! 🪄`);
    button = new ButtonBuilder().setCustomId('wiseacreswizardingwquipmentTelescopioCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Telescópio  - 1$G');
    let button2 = new ButtonBuilder().setCustomId('wiseacreswizardingwquipmentBalacaCompra').setStyle(ButtonStyle.Primary).setLabel('Comprar Balança de Latão - 1$G');
    row = new ActionRowBuilder().addComponents(button).addComponents(button2);
    await wiseacreswizardingwquipmentchannel.send({ embeds: [embedImg,embed], components: [row], ephemeral: false });

    // Empório das Corujas
    const emporiodascorujaschannel = guild.channels.cache.find((c) => c.name === 'emporio-de-corujas-correio-corujas');
    fetchedMessages = await emporiodascorujaschannel.messages.fetch({ limit: 100 });
    await emporiodascorujaschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/uBmnuhg.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle(`Empório das Corujas - Sua Conexão com o Mundo Mágico`).setDescription(`🧙‍♂️ Bem-vindo ao Empório das Corujas - Sua Conexão com o Mundo Mágico!

Aqui encontrará corujas majestosas e confiáveis para todas as suas necessidades de correspondência e companhia. Desde a ágil coruja-das-torres à resistente coruja-das-neves, temos o parceiro alado perfeito para cada feiticeiro.

Além disso, oferecemos tudo o que sua coruja precisa: gaiolas encantadas, rações especiais e acessórios mágicos para garantir o máximo conforto e eficiência.

Escolha com sabedoria, pois uma boa coruja é mais do que um mensageiro - é um amigo leal! Se precisar de ajuda, estamos aqui para auxiliar. 🪄✨`);

    const corujasList = [
        "Coruja Aguia",
        "Coruja Barrada",
        "Coruja Chifruda",
        "Coruja Cinzenta",
        "Coruja das Neves",
        "Coruja das Torres",
        "Coruja de Cabeça Laranja",
        "Coruja de Calda Longa",
        "Coruja de Olhos Miudos",
        "Coruja do Campo",
        "Coruja do Leste",
        "Coruja do Oeste",
        "Coruja Dourada",
        "Coruja Marrom",
        "Coruja Negra",
        "Coruja Observadora",
        "Coruja Parda",
        "Coruja Piante"
    ];

    let buttonsList = [];
    for(const coruja of corujasList){
        buttonsList.push( new ButtonBuilder().setCustomId(`emporiodascorujas_${coruja.replace(/\s+/g, '')}`).setStyle( ButtonStyle.Primary).setLabel(`🦉 Comprar ${coruja}  - 10$G`) )
    }
    let buttonsAux = [...buttonsList]
    row = []
    while(buttonsAux.length > 0){
        row.push({type:1, components: [...buttonsAux.slice(0,5)] })
        buttonsAux = buttonsAux.slice(5)
    }

    await emporiodascorujaschannel.send({ embeds: [embedImg,embed], components: row, ephemeral: false });

    // Animais Mágicos (para gatos, sapos e outros).
    const animaismagicoschannel = guild.channels.cache.find((c) => c.name === 'animais-magicos');
    fetchedMessages = await animaismagicoschannel.messages.fetch({ limit: 100 });
    await animaismagicoschannel.bulkDelete(fetchedMessages, true);

    embedImg = new EmbedBuilder().setColor('#ffad00').setImage('https://imgur.com/YZyb3SY.png');
    embed = new EmbedBuilder().setColor('#ffad00').setTitle(`Animais Mágicos - Criaturas Fantásticas Esperam por Você`).setDescription(`🧙‍♂️ Bem-vindo à Animais Mágicos - Criaturas Fantásticas Esperam por Você!

Explore um mundo encantado repleto de companheiros mágicos! Desde sapos saltitantes e ratos astutos a majestosos gatos mágicos e majestosas criaturas raras, aqui encontrará o amigo perfeito para partilhar suas aventuras.

Também oferecemos uma variedade de alimentos encantados, habitats personalizados e acessórios mágicos para garantir que seu novo companheiro receba o melhor cuidado possível.

Porque todo grande bruxo merece uma criatura mágica ao seu lado! Se precisar de ajuda para escolher ou cuidar do seu novo amigo, estamos à disposição. 🪄✨`);

    const animaisList = [
        "Puffskein",
        "Kneazle",
        "Rato",
        "Sapo"
    ];

    buttonsList = [];
    for(const animal of animaisList){
        buttonsList.push( new ButtonBuilder().setCustomId(`animaismagicos_${animal.replace(/\s+/g, '')}`).setStyle( ButtonStyle.Primary).setLabel(`Comprar ${animal}  - 10$G`) )
    }
    buttonsAux = [...buttonsList]
    row = []
    while(buttonsAux.length > 0){
        row.push({type:1, components: [...buttonsAux.slice(0,5)] })
        buttonsAux = buttonsAux.slice(5)
    }

    await animaismagicoschannel.send({ embeds: [embedImg,embed], components: row, ephemeral: false });
}

async function checkUsersInventory(guild) {
    const members = await guild.members.fetch();
    for (const member of members) {
        if(member[1].user.bot)  continue;

        const user = member[1].user;
        if (!fs.existsSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`)) {
            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`,
                JSON.stringify({inventario:{}}), (err) => {
                    if (err) {
                        console.error('Erro ao criar o arquivo inventário:', err);
                    } else {
                        console.log('Arquivo inventário criado com sucesso!');
                    }
                }
            );
        }
    }
}

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setName('startdiscord')
        .setDescription('[ADM] Criar todas a estrutura do discord'),
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true }).catch( () => {} );
        
        const guild = client.guilds.cache.get(interaction.guildId);
        if (!guild) return console.error("Guild not found");

        await guild.roles.fetch(); // Força o carregamento da cache
        await guild.channels.fetch();
        
        if (!guild.roles || !guild.roles.cache || !guild.channels || !guild.channels.cache) {
            console.error("Roles or channels cache is unavailable.");
            return;
        }

        await createRpgRoles(client, guild)
        await createStructure(client, guild)
        await setupExpressoChannel(guild)
        await startMessageCartaHogwarts(guild)
        await startMapaHogwarts(guild)
        await manageBecoDiagonal(guild)
        await checkUsersInventory(guild)

        await interaction.editReply({ content: 'Estrutura criada com sucesso!', ephemeral: true });
    }
}