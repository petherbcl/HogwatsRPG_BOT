const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const {StringFormat, RemoveSpecialCharacters, FichaToPDF} = require('../utils/utils.js');

const spell_by_year = JSON.parse(fs.readFileSync(`./RPGData/spell_by_year.json`, 'utf8'))
const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
const vantagem_desvantagem_by_year = JSON.parse(fs.readFileSync(`./RPGData/vantagem_desvantagem_by_year.json`, 'utf8'))
const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))
const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

const questions = {

    name: { label: 'Nome:', type: 'string', question: true },
    house: { label: 'Casa de Hogwarts: (Grifinória, Sonserina, Corvinal, Lufa-Lufa)?', type: 'string', question: true },
    //year: { label: 'Ano Escolar: (1, 2, 3, 4, 5, 6, 7)?', type: 'number', question: true },
    job: { label: 'Você é Aluno ou Professor?\nResponda com *Aluno* ou *Professor*', type: 'string', question: true },
    race: { label: 'Raça: (Humano, meio-veela, lobisomem, mestiço, etc.)', type: 'string', question: true },
    age: { label: 'Idade:', type: 'number', question: true },

    features: { label: 'Características\n*Distribua {0} pontos entre as características:*\n* **Força(F)**\n* **Habilidade(H)**\n* **Resistência(R)**\n* **Armadura(A)**\n* **Poder de Fogo(PdF)**', type: 'string', question: false },
    F: { label: 'Força (F):', type: 'number', question: true },
    H: { label: 'Habilidade (H):', type: 'number', question: true },
    R: { label: 'Resistência (R):', type: 'number', question: true },
    A: { label: 'Armadura (A):', type: 'number', question: true },
    PdF: { label: 'Poder de Fogo (PdF):', type: 'number', question: true },

    spells: { label: 'Irá escolher até 3 feitiços conhecidos da lista abaixo\n*Lista de feitiços:* {0}\n\n*Pode consultar mais detalhes em <#1334980589652148244>*\n\n**Feitiços Conhecidos:**\n-# *Separe os feitiços por virgula*', type: 'string', question: true },

    vantagens: { label: 'Irá escolher até 3 vantagens da lista abaixo\n*Lista de Vantagens:* {0}\n\n*Pode consultar mais detalhes em <#1334975689257914480>*\n\n**Vantagens:**\n-# Separe as vantagens por virgula', type: 'string', question: true },

    desvantagens: { label: 'Irá escolher até 3 desvantagens da lista abaixo\n*Lista de Desvantagens:* {0}\n\n*Pode consultar mais detalhes em <#1334975689257914480>*\n\n**Desvantagens:**\n-# Separe as desvantagens por virgula', type: 'string', question: true },

    vantagem_obrigatoria: { label: 'Vantagem Obrigatória.\nEscolha uma das seguintes:\n*Magia Branca* , *Magia Elemental* , *Magia Negra*', type: 'string', question: true },

    appearance: { label: 'Aparência:', type: 'string', question: true },
    personality: { label: 'Personalidade:', type: 'string', question: true },
    history: { label: 'História/Antecedentes:', type: 'string', question: true },
}

const fichaCampos = {
    name: 'Nome',
    house: 'Casa de Hogwarts',
    year: 'Ano Escolar',
    race: 'Raça',
    age: 'Idade',
    job: 'Cargo',
    F: 'Força (F)',
    H: 'Habilidade (H)',
    R: 'Resistência (R)',
    A: 'Armadura (A)',
    PdF: 'Poder de Fogo (PdF)',
    PV: 'Pontos de Vida',
    PM: 'Pontos de Magia',
    PE: 'Pontos de Experiência',

    spells: 'Feitiços Conhecidos',
    vantagens: 'Vantagens',
    desvantagens: 'Desvantagens',
    vantagem_obrigatoria: 'Vantagem Obrigatória',

    appearance: 'Aparência',
    personality: 'Personalidade',
    history: 'História/Antecedentes',
}

function answerValidator(index, answer) {
    const key = Object.keys(questions)[index];
    const question = Object.values(questions)[index];

    if (question.type === 'number') {

        if (isNaN(answer)) {
            return 'Por favor, responda com um número.';
        }

        if (key === 'year' && (answer < 1 || answer > 7)) {
            return 'Por favor, responda com um número entre 1 e 7.';
        }
    }

    if (key === 'job' && !['ALUNO', 'PROFESSOR'].includes(answer.toUpperCase())) {
        return 'Por favor, responda com *Aluno* ou *Professor*';
    }

    if (key === 'house' && !['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'].includes(answer)) {
        return 'Por favor, responda com uma das casas de Hogwarts';
    }

    if (key === 'vantagem_obrigatoria' && !['Magia Branca', 'Magia Elemental', 'Magia Negra'].includes(answer)) {
        return 'Por favor, responda com uma das Vantagens Obrigatórias';
    }

    if (key === 'spells') {
        const spells = answer.split(',').map(v => v.trim());
        if (spells.length > 3) {
            return 'Por favor, responda com até 3 feitiços.';
        }

        for(let i=0; i<spells.length; i++){
            const spell = spells[i]
            if (!Object.values(spell_list).map(s => s.name.toUpperCase()).includes(spell.toUpperCase())) {
                return 'Por favor, escolhe feitiços da lista';
            }
        }

    }

    if (key === 'vantagens') {
        const vantagens = answer.split(',').map(v => v.trim());
        if (vantagens.length > 3) {
            return 'Por favor, responda com até 3 vantagens.';
        }

        for(let i=0; i<vantagens.length; i++){
            const vantagem = vantagens[i]
            if (!Object.values(vantagem_list).map(v => v.label.toUpperCase()).includes(vantagem.toUpperCase())) {
                return 'Por favor, escolha vantagens da lista';
            }
        }
        
    }

    if (key === 'desvantagens') {
        const devantagens = answer.split(',').map(v => v.trim());
        if (devantagens.length > 3) {
            return 'Por favor, responda com até 3 vantagens.';
        }

        for(let i=0; i<devantagens.length; i++){
            const devantagem = devantagens[i]
            if (!Object.values(desvantagem_list).map(v => v.label.toUpperCase()).includes(devantagem.toUpperCase())) {
                return 'Por favor, escolha desvantagens da lista';
            }
        }

    }

    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarficha')
        .setDescription('Inicia ficha de personagem.'),
    async execute(interaction, client) {

        const guild = interaction.member.guild
        const member = guild.members.cache.get(interaction.user.id);
        const channel = interaction.channel;
        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Criação de Ficha de Personagem')

        const ficha_personagem = {
            name: null,
            house: null,
            job: null,
            year: null,
            race: null,
            age: null,
            F: null,
            H: null,
            R: null,
            A: null,
            PdF: null,
            PV: null,
            PVMax: null,
            PM: null,
            PMMax: null,
            PE: null,
            spells: null,
            vantagens: null,
            desvantagens: null,
            vantagem_obrigatoria: null,
            appearance: null,
            personality: null,
            history: null,
        }

        if(channel.name !== `carta-de-${RemoveSpecialCharacters(member.user.username)}-${member.user.id}`){
            return interaction.reply({ content: `Esse comando só pode ser usado no canal **carta-de-${RemoveSpecialCharacters(member.user.username)}-${member.user.id}**`, ephemeral: true });
        }

        const filter = response => response.author.id === interaction.user.id;
        let currentQuestion = 0;
        let PE = 0

        const askQuestion = async () => {
            try {
                if (currentQuestion < Object.values(questions).length) {
                    const key = Object.keys(questions)[currentQuestion];
                    const question = {...Object.values(questions)[currentQuestion]};

                    if (!ficha_personagem[key]) {

                        if (key === 'spells') {
                            const spellyear = spell_by_year[ficha_personagem.year];
                            question.label = StringFormat(question.label, spellyear.map(spell => spell_list[spell].name).join(', '))
                        } else if (key === 'vantagens') {
                            if(typeof(ficha_personagem['year'])==='number'){
                                const vantagemyear = vantagem_desvantagem_by_year[ficha_personagem.year].vantagem
                                question.label = StringFormat(question.label, vantagemyear.map(v => vantagem_list[v].label).join(', '))
                            }else{
                                question.label = StringFormat(question.label, Object.values(vantagem_list).map( v => v.label).join(', '))
                            }
                            
                        } else if (key === 'desvantagens') {
                            if(typeof(ficha_personagem['year'])==='number'){
                                const desvantagemyear = vantagem_desvantagem_by_year[ficha_personagem.year].desvantagem
                                question.label = StringFormat(question.label, desvantagemyear.map(v => desvantagem_list[v].label).join(', '))
                            }else{
                                question.label = StringFormat(question.label, Object.values(desvantagem_list).map( v => v.label).join(', '))
                            }
                        } else if (key === 'features') {
                            question.label = StringFormat(question.label, PE)
                        }

                        if(currentQuestion > 0 && question.question===true ){
                            const fetchedMessages = await channel.messages.fetch({ limit: 1 });
                            await channel.bulkDelete(fetchedMessages, true);
                        }

                        embed.setDescription(question.label)
                        await interaction.editReply({ embeds: [embed], ephemeral: true });

                        if (question.question) {

                            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });
                            let answer = collected.first().content;
                            if (collected.first().attachments.size > 0) {
                                const attachment = collected.first().attachments.first();
                                const response = await fetch(attachment.url);
                                answer = await response.text();
                                console.log(attachment.url, response)
                            }
                            answer.replace(`"`, `'`)
                            answer = question.type === 'number' ? parseInt(answer) : answer;

                            const validation = answerValidator(currentQuestion, answer)
                            if (validation) {
                                embed.setDescription(validation)
                                await interaction.editReply({ embeds: [embed], ephemeral: true });

                                await new Promise(resolve => setTimeout(resolve, 3000));
                                return askQuestion();
                            }

                            if (key === 'spells') {
                                const spells = answer.split(',').map(v => v.trim());
                                answer = [];
                                spells.forEach(spell => {
                                    const id = Object.keys(spell_list).find(key => spell_list[key].name.toUpperCase() === spell.toUpperCase());
                                    answer.push(id)
                                })

                                ficha_personagem[key] = answer
                            } else if (key === 'vantagens') {
                                const vantagens = answer.split(',').map(v => v.trim());
                                answer = [];
                                vantagens.forEach(vantagem => {
                                    const id = Object.keys(vantagem_list).find(key => vantagem_list[key].label.toUpperCase() === vantagem.toUpperCase());
                                    answer.push(id)
                                })

                                ficha_personagem[key] = answer
                            } else if (key === 'desvantagens') {
                                const desvantagens = answer.split(',').map(v => v.trim());
                                answer = [];
                                desvantagens.forEach(desvantagem => {
                                    const id = Object.keys(desvantagem_list).find(key => desvantagem_list[key].label.toUpperCase() === desvantagem.toUpperCase());
                                    answer.push(id)
                                })

                                ficha_personagem[key] = answer
                            } else if (key === 'job') {
                                const job = answer.toUpperCase()
                                if (job === 'ALUNO') {
                                    ficha_personagem['job'] = 'ALUNO'
                                    ficha_personagem['year'] = 1
                                    ficha_personagem['age'] = 11
                                    PE = 6
                                } else if (job === 'PROFESSOR') {
                                    ficha_personagem['job'] = 'PROFESSOR'
                                    ficha_personagem['year'] = 0
                                    ficha_personagem['spells'] = Object.keys(spell_list)
                                    PE = 24
                                }
                            } else {
                                ficha_personagem[key] = answer
                            }

                            // console.log(`Pergunta: ${question.label}, Resposta: ${answer}`);
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        }
                    }

                    currentQuestion++;
                    askQuestion();
                } else {
                    const fetchedMessages = await channel.messages.fetch({ limit: 1 });
                    await channel.bulkDelete(fetchedMessages, true);

                    if (ficha_personagem.F + ficha_personagem.H + ficha_personagem.R + ficha_personagem.A + ficha_personagem.PdF > PE) {
                        embed.setDescription(`*Pontos distribuidos entre as características superiores ao permitido. Terá que refazer a ficha.*`)
                        await interaction.editReply({ embeds: [embed], ephemeral: true });
                    } else {
                        ficha_personagem.PV = ficha_personagem.R * 5;
                        ficha_personagem.PM = ficha_personagem.R * 5;

                        ficha_personagem.PVMax = ficha_personagem.R * 5;
                        ficha_personagem.PMMax = ficha_personagem.R * 5;

                        ficha_personagem.PE = 0;

                        fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`,
                                                    JSON.stringify(ficha_personagem), (err) => {
                                                        if (err) {
                                                            console.error('Erro ao criar ficha de personagem:', err);
                                                        } else {
                                                            console.log('Ficha de personagem criado com sucesso!');
                                                        }
                                                    }
                                        );

                        // Alterar o nickname do usuário
                        const newNickname = ficha_personagem.name;
                        await member.setNickname(newNickname).catch(console.error);

                        embed.setDescription(`*Ficha de personagem concluído!*`)
                        await interaction.editReply({ embeds: [embed], ephemeral: true });

                        const fichaText = `**Ficha de Personagem de ${member.nickname || member.user.globalName || member.user.username}**

**${fichaCampos['name']}:** ${ficha_personagem['name']}
**${fichaCampos['age']}:** ${ficha_personagem['age']}
**${fichaCampos['race']}:** ${ficha_personagem['race']}
**${fichaCampos['house']}:** ${ficha_personagem['house']}
**${fichaCampos['job']}:** ${ficha_personagem['job']}
**${fichaCampos['year']}:** ${ficha_personagem['year']}
**${fichaCampos['F']}:** ${ficha_personagem['F']}
**${fichaCampos['H']}:** ${ficha_personagem['H']}
**${fichaCampos['R']}:** ${ficha_personagem['R']}
**${fichaCampos['A']}:** ${ficha_personagem['A']}
**${fichaCampos['PdF']}:** ${ficha_personagem['PdF']}
**${fichaCampos['PV']}:** ${ficha_personagem['PV']} / ${ficha_personagem['PVMax']}
**${fichaCampos['PM']}:** ${ficha_personagem['PM']} / ${ficha_personagem['PMMax']}
**${fichaCampos['PE']}:** ${ficha_personagem['PE']}
**${fichaCampos['spells']}:** ${ficha_personagem['spells'].map( spell => spell_list[spell].name).join(' , ')}
**${fichaCampos['vantagens']}:** ${ficha_personagem['vantagens'].map( vantagem => vantagem_list[vantagem].label).join(' , ')}
**${fichaCampos['desvantagens']}:** ${ficha_personagem['desvantagens'].map( desvantagem => desvantagem_list[desvantagem].label).join(' , ')}
**${fichaCampos['vantagem_obrigatoria']}:** ${ficha_personagem['vantagem_obrigatoria']}
**${fichaCampos['appearance']}:**\n ${ficha_personagem['appearance']}
**${fichaCampos['personality']}:**\n ${ficha_personagem['personality']}
**${fichaCampos['history']}:**\n ${ficha_personagem['history']}`;

                        const filePath = path.join('./tempdata/', `ficha_personagem_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.txt`);
                        fs.writeFileSync(filePath, fichaText);

                        let attachment = new AttachmentBuilder(filePath);

                        await interaction.followUp({ files: [attachment] });

                        // Remover o arquivo temporário após o envio
                        fs.unlinkSync(filePath);

                        interaction.followUp({ content: 'Gerando ficha em PDF. Poderá demorar alguns segundos', ephemeral: true });

                        await FichaToPDF(member.user.username,member.user.id)
                        const filePathDoc = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.docx`);
                        const filePathPdf = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.pdf`);
        
                        attachment = new AttachmentBuilder(filePathPdf);
                        interaction.followUp({ files: [attachment], ephemeral: true });
        
                        await new Promise(resolve => setTimeout(resolve, 5000));
        
                        fs.unlinkSync(filePathDoc);
                        fs.unlinkSync(filePathPdf);
                    }
                }
            } catch (error) {
                console.log(error);
                embed.setDescription(`**Tempo de espera ultrapassado!**`)
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        };

        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        embed.setDescription(`**Iniciando Ficha de personagem**\n*Para cada pergunta terá o tempo de 5 minutos para responder*`)
        await interaction.editReply({ embeds: [embed], ephemeral: true });
        await new Promise(resolve => setTimeout(resolve, 5000));

        askQuestion();

    },
};