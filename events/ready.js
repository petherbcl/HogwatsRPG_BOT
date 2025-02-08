const { ActivityType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.user.setActivity({
            name: "Bem vindo a Hogwarts RPG.",
            type: ActivityType.Custom,
        });

        const guild = client.guilds.cache.get('1312930894235041844'); // SERVER ID
        if (!guild) return console.error("Guild not found");

        await guild.roles.fetch(); // Força o carregamento da cache
        await guild.channels.fetch();

        if (!guild.roles || !guild.roles.cache) {
            console.error("Roles cache is unavailable.");
            return;
        }

        client.isMoving = {};
        client.roomRoles = {
            'carta-de-hogwarts': 'CartaDeHogwarts',
            'caldeirão-furado': 'CaldeiraoFurado',

            'beco-diagonal': 'BecoDiagonal',
            'banco-gringotes': 'BecoDiagonal',
            'floreios-e-borrões': 'BecoDiagonal',
            'olivaras': 'BecoDiagonal',
            "madame-malkins-roupas-para-todas-as-ocasioes": 'BecoDiagonal',
            'loja-de-caldeiroes-de-potage': 'BecoDiagonal',
            'boticario-slug-e-jiggers': 'BecoDiagonal',
            "wiseacres-wizarding-equipment": 'BecoDiagonal',
            'emporio-de-corujas-correio-corujas': 'BecoDiagonal',
            'animais-magicos': 'BecoDiagonal',

            'expresso-de-hogwarts': 'ExpressoHogwarts',

            'corredor-da-masmorra-leste': 'MasmorasLesteCorredor',
            'sala-comunal-sonserina': 'SalaComunalSonserina',
            'sala-de-detenção': 'SalaDetencao',
            'banheiro-da-murta-que-geme': 'BanheiroMurtaGeme',

            'corredor-da-masmorra-oeste': 'MasmorasOesteCorredor',
            'sala-aula-estudos-dos-trouxas': 'AulaEstudoDosTrouxas',
            'sala-aula-alquimia': 'AulaAlquimia',

            'hall-central': 'HallCentral',
            'biblioteca': 'BibliotecaInterior',
            'biblioteca-area-restrita': 'BibliotecaInteriorAreaRestrita',
            'sala-aula-herbologia': 'AulaHerbologia',
            'sala-aula-transfiguração': 'AulaTransfiguração',
            'sala-aula-historia-da-magia': 'AulaHistoriaMagia',
            'sala-aula-poções': 'AulaPocoes',

            'corredor-piso-1': 'CorredorPiso1',
            'cozinha': 'Cozinha',
            'sala-comunal-lufa-lufa': 'SalaComunalLufaLufa',

            'corredor-piso-2': 'Piso2Corredor',
            'sala-aula-defesa-artes-das-trevas': 'AulaDefesaArteTrevas',

            'patio-do-viaduto': 'PatioViaduto',
            'hall-de-entrada': 'HallEntrada',
            'grande-salão': 'GrandeSalao',
            'grande-escadaria-3': 'GrandeEscadaria3',
            'torre-do-relogio': 'TorreRelogio',
            'patio-torre-do-relogio': 'PatioTorreRelogio',
            'cabana-dos-barcos': 'CabanaBarcos',
            'patio-torre-norte': 'PatioTorreNorte',

            'grande-escadaria-4': 'GrandeEscadaria4',
            'sala-comunal-corvinal': 'SalaComunalCorvinal',

            'grande-escadaria-5': 'GrandeEscadaria5',
            'corredor-piso-5-leste': 'Piso5LesteCorredor',
            'sala-comunal-grifinória': 'SalaComunalGrifinoria',
            'corredor-piso-5-oeste': 'CorredorPiso5Oeste',
            'sala-aula-aritmancia': 'AulaAritmancia',
            'sala-aula-encantamentos': 'AulaEncantamentos',
            'sala-aula-adivinhação': 'AulaAdivinhação',

            'corredor-torre-do-relogio': 'CorredorTorreRelogio',
            'banheiro-dos-prefeitos': 'BanheiroPrefeitos',
            'corredor-piso-7': 'CorredorPiso7',
            'sala-precisa': 'SalaPrecisa',

            'enfermaria': 'Enfermaria',
            'corredor-piso-8': 'CorredorPiso8',
            'sala-aula-astronomia': 'AulaAstronomia',

            'observatorio': 'Observatorio',

            'grande-escadaria-14': 'GrandeEscadaria14',
            'sala-do-diretor': 'SalaDoDiretor',

            'jardins-de-hogwarts': 'JardinsDeHogwarts',
            'estufas': 'Estufas',
            'torre-das-corujas': 'TorreDasCorujas',
            'campo-quadribol': 'CampoQuadribol',
            'sala-aula-trato-criaturas-mágicas': 'AulaTratoCriaturasMagicas',
            'aula-voo': 'AulaVoo',
            'lago-negro': 'LagoNegro',
            'floresta-proibida': 'FlorestaProibida',
            'cabana-guarda-caças': 'CabanaGuardaCaças'
        };

        client.roomsList = {
            // TERRENOS DO CASTELO
            'jardins-de-hogwarts': [
                { room: 'hall-central', label: '🚪 Hall Central - Piso 0'},
                { room: 'estufas', label: '🚪 Estufas' },
                { room: 'campo-quadribol', label: '🚶 Campo de Quadribol' },
                { room: 'torre-das-corujas', label: '🚶 Torre das Corujas' },
                { room: 'sala-aula-trato-criaturas-mágicas', label: '🚶 Aula Trato da Criaturas Mágicas' },
                { room: 'aula-voo', label: '🚶 Aula de Voo' },
                { room: 'lago-negro', label: '🚶 Lago Negro' },
                // { room: 'floresta-proibida', label: '🚶 Floresta Proibida' },
                { room: 'cabana-guarda-caças', label: '🚪 Cabana do Guarda Caças' },                
            ],
            'estufas': [
                { room: 'jardins-de-hogwarts', label: '🚪 Sair para os Jardins de Hogwarts' },
                { room: 'sala-aula-herbologia', label: '🚪 Aula Herbologia' },
            ],
            'campo-quadribol': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'torre-das-corujas': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'sala-aula-trato-criaturas-mágicas': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'aula-voo': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'lago-negro': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'floresta-proibida': [
                { room: 'jardins-de-hogwarts', label: '🚶 Jardins de Hogwarts' },
            ],
            'cabana-guarda-caças': [
                { room: 'jardins-de-hogwarts', label: '🚪 Jardins de Hogwarts' },
            ],

            // PISO -1 LESTER
            'corredor-da-masmorra-leste': [
                { room: 'sala-comunal-sonserina', role: 'Sonserina', label: '🐍 Sala Comunal Sonserina' },
                { room: 'sala-de-detenção', label: '🚪 Sala de Detenção' },
                { room: 'banheiro-da-murta-que-geme', label: '🚪 Banheiro da Murta que Geme' },
                { room: 'grande-escadaria-3', label: '↗️ Grande Escadaria - Piso 3' },
            ],
            'sala-comunal-sonserina': [
                { room: 'corredor-da-masmorra-leste', label: '🚪 Corredor da Masmorra Leste' }
            ],
            'sala-de-detenção': [
                { room: 'corredor-da-masmorra-leste', label: '🚪 Corredor da Masmorra Leste' }
            ],
            'banheiro-da-murta-que-geme': [
                { room: 'corredor-da-masmorra-leste', label: 'Corredor da Masmorra Leste' }
            ],

            // PISO -1 OESTE
            'corredor-da-masmorra-oeste': [
                { room: 'hall-central', label: '↗️ Hall Central - Piso 1' },
                { room: 'sala-aula-estudos-dos-trouxas', label: '🚪 Sala de Aula de Estudos dos Trouxas' },
                { room: 'sala-aula-alquimia', label: '🚪 Sala de Aula de Alquimia' }
            ],
            'sala-aula-estudos-dos-trouxas': [
                { room: 'corredor-da-masmorra-oeste', label: '🚪 Corredor da Masmorra Oeste' }
            ],
            'sala-aula-alquimia': [
                { room: 'corredor-da-masmorra-oeste', label: '🚪 Corredor da Masmorra Oeste' }
            ],

            // PISO 0
            'hall-central': [
                { room: 'corredor-da-masmorra-oeste', label: '↙️ Masmoras Oeste- Piso -1' },
                { room: 'jardins-de-hogwarts', label: '🚪 Sair para o exterior do castelo' },
                { room: 'biblioteca', label: '🚪 Biblioteca' },
                { room: 'sala-aula-herbologia', label: '🚪 Aula Herbologia' },
                { room: 'sala-aula-transfiguração', label: '🚪 Aula Transfiguração' },
                { room: 'sala-aula-historia-da-magia', label: '🚪 Aula História da Magia' },
                { room: 'sala-aula-poções', label: '🚪 Aula de Pocões' },
                { room: 'corredor-piso-2', label: '↗️ Corredor - Piso 2' },
                { room: 'patio-torre-norte', label: '↗️ Pátio Torre Norte - Piso 3' },
            ],
            'biblioteca': [
                { room: 'hall-central', label: '🚪 Hall Central' },
                { room: 'biblioteca-area-restrita', label: '🚪 Area Restrita' }
            ],
            'biblioteca-area-restrita': [
                { room: 'biblioteca', label: '🚪 Biblioteca' }
            ],
            'sala-aula-herbologia': [
                { room: 'hall-central', label: '🚪 Hall Central' },
                { room: 'estufas', label: '🚶 Estufas' },
            ],
            'sala-aula-transfiguração': [
                { room: 'hall-central', label: '🚪 Hall Central' },
            ],
            'sala-aula-historia-da-magia': [
                { room: 'hall-central', label: '🚪 Hall Central' },
            ],
            'sala-aula-poções': [
                { room: 'hall-central', label: '🚪 Hall Central' },
            ],

            // PISO 1
            'corredor-piso-1': [
                { room: 'hall-de-entrada', label: '↗️ Hall Entrada - Piso 3' },
                { room: 'cozinha', label: '🚪 Cozinha' },
                { room: 'sala-comunal-lufa-lufa', role: 'LufaLufa', label: '🦝 Sala Comunal Lufa Lufa' },
            ],
            'cozinha': [
                { room: 'corredor-piso-1', label: '🚪 Corredor Piso 1' },
            ],
            'sala-comunal-lufa-lufa': [
                { room: 'corredor-piso-1', label: '🚪 Corredor Piso 1' },
            ],

            // PISO 2
            'corredor-piso-2': [
                { room: 'hall-central', label: '↙️ Hall Central - Piso 0' },
                { room: 'sala-aula-defesa-artes-das-trevas', label: '🚪 Aula Defesa Contra as Artes da Trevas' },
                { room: 'patio-do-viaduto', label: '↗️ Pátio do Viaduto - Piso 3' },
            ],
            'sala-aula-defesa-artes-das-trevas': [
                { room: 'corredor-piso-2', label: '🚪 Corredor Piso 2' },
            ],

            // PISO 3
            'patio-do-viaduto': [
                { room: 'corredor-piso-2', label: '↙️ Corredor - Piso 2' },
                { room: 'cabana-dos-barcos', label: '🚶 Cabana dos Barcos' },
                { room: 'patio-torre-norte', label: '🚶 Pátio Torre Norte' },
                { room: 'hall-de-entrada', label: '🚪 Hall de Entrada' },
                { room: 'torre-do-relogio', label: '🚪 Torre do Relógio' },
            ],
            'cabana-dos-barcos': [
                { room: 'patio-do-viaduto', label: '🚶 Pátio do Viaduto' },
            ],
            'patio-torre-norte': [
                { room: 'hall-central', label: '↙️ Hall Central - Piso 1' },
                { room: 'patio-do-viaduto', label: '🚶 Pátio do Viaduto' },
                { room: 'corredor-piso-5-oeste', label: '↗️ Corredor - Piso 5 Oeste' },
            ],
            'hall-de-entrada': [
                { room: 'corredor-piso-1', label: '↙️ Corredor - Piso 1' },
                { room: 'patio-do-viaduto', label: '🚪 Pátio do Viaduto' },
                { room: 'grande-salão', label: '🚪 Grande Salão' },
                { room: 'grande-escadaria-3', label: '🚶 Grande Escadaria' },
            ],
            'torre-do-relogio': [
                { room: 'patio-do-viaduto', label: '🚪 Pátio do Viaduto' },
                { room: 'patio-torre-do-relogio', label: '🚪 Pátio da Torre do Relógio' },
                { room: 'corredor-torre-do-relogio', label: '↗️ Torre do Relógio - Piso 7' },
            ],
            'patio-torre-do-relogio': [
                { room: 'torre-do-relogio', label: '🚪 Torre do Relógio' },
            ],
            'grande-salão': [
                { room: 'hall-de-entrada', label: '🚪 Hall de Entrada' },
            ],
            'grande-escadaria-3': [
                { room: 'corredor-da-masmorra-leste', label: '↙️ Masmorra Leste - Piso -1' },
                { room: 'hall-de-entrada', label: '🚶 Hall de Entrada' },
                { room: 'grande-escadaria-4', label: '↗️ Grande Escadaria - Piso 4' },
            ],

            // PISO 4
            'grande-escadaria-4': [
                { room: 'grande-escadaria-3', label: '↙️ Grande Escadaria - Piso 3' },
                { room: 'sala-comunal-corvinal', role: 'Corvinal', label: '🐦‍⬛ Sala Comunal Corvinal' },
                { room: 'grande-escadaria-5', label: '↗️ Grande Escadaria - Piso 5' },
            ],
            'sala-comunal-corvinal': [
                { room: 'grande-escadaria-4', label: '🚪 Grande Escadaria' },
            ],

            // PISO 5 ESTE
            'grande-escadaria-5': [
                { room: 'grande-escadaria-4', label: '↙️ Grande Escadaria - Piso 4' },
                { room: 'corredor-piso-5-leste', label: '🚶 Corredor Piso 5' },
                { room: 'grande-escadaria-14', label: '↗️ Grande Escadaria - Piso 14' },
            ],
            'corredor-piso-5-leste': [
                { room: 'grande-escadaria-5', label: '🚶 Grande Escadaria' },
                { room: 'sala-comunal-grifinória', role: 'Grifinória', label: '🦁 Sala Comunal Grifinória' },
                { room: 'corredor-torre-do-relogio', label: '↗️ Torre do Relógio - Piso 7' },
            ],
            'sala-comunal-grifinória': [
                { room: 'corredor-piso-5-leste', label: '🚪 Corredor Piso 5' },
            ],

            // PISO 5 OESTE
            'corredor-piso-5-oeste': [
                { room: 'patio-torre-norte', label: '↙️ Torre Norte - Piso 3' },
                { room: 'sala-aula-aritmancia', label: '🚪 Aula Aritmância' },
                { room: 'sala-aula-encantamentos', label: '🚪 Aula Encantamentos' },
                { room: 'sala-aula-adivinhação', label: '🚪 Aula Adivinhação' },
                { room: 'corredor-piso-7', label: '↗️ Corredor - Piso 7' },
            ],
            'sala-aula-aritmancia': [
                { room: 'corredor-piso-5-oeste', label: '🚪 Corredor Piso 5' },
            ],
            'sala-aula-encantamentos': [
                { room: 'corredor-piso-5-oeste', label: '🚪 Corredor Piso 5' },
            ],
            'sala-aula-adivinhação': [
                { room: 'corredor-piso-5-oeste', label: '🚪 Corredor Piso 5' },
            ],

            // PISO 7 LESTE
            'corredor-torre-do-relogio': [
                { room: 'torre-do-relogio', label: '↙️ Torre do Relógio - Piso 3' },
                { room: 'corredor-piso-5-leste', label: '↙️ Corredor Leste - Piso 5' },
                { room: 'banheiro-dos-prefeitos', label: '🚪 Banheiro dos Prefeitos' },
                { room: 'enfermaria', label: '↗️ Enfermaria - Piso 8' },
            ],
            'banheiro-dos-prefeitos': [
                { room: 'corredor-torre-do-relogio', label: '🚪 Corredor Torre do Relógio' },
            ],

            // PISO 7 OESTE
            'corredor-piso-7': [
                { room: 'corredor-piso-5-oeste', label: '↙️ Corredor Oeste - Piso 5' },
                { room: 'sala-precisa', label: '🚪 Sala Precisa' },
                { room: 'corredor-piso-8', label: '↗️ Corredor - Piso 8' },
            ],
            'sala-precisa': [
                { room: 'corredor-piso-7', label: '🚪 Corredor Piso 7' },
            ],

            // PISO 8
            'corredor-piso-8': [
                { room: 'corredor-piso-7', label: '↙️ Corredor - Piso 7' },
                { room: 'sala-aula-astronomia', label: '🚪 Sala Astronomia' },
                { room: 'observatorio', label: '↗️ Observatorio - Piso 12' },
            ],
            'sala-aula-astronomia': [
                { room: 'corredor-piso-8', label: '🚪 Corredor Piso 8' },
            ],

            'enfermaria': [
                { room: 'corredor-torre-do-relogio', label: '↙️ Torre do Relógio - Piso 7' },
            ],

            // PISO 12
            'observatorio': [
                { room: 'corredor-piso-8', label: '↙️ Corredor - Piso 8' },
            ],

            // PISO 14
            'grande-escadaria-14': [
                { room: 'grande-escadaria-5', label: '↙️ Grande Escadaria - Piso 5' },
                { room: 'sala-do-diretor', label: '🚪 Sala do Diretor' },
            ],
            'sala-do-diretor': [
                { room: 'grande-escadaria-14', label: '🚪 Grande Escadaria' },
            ],
        }

        client.rpgRoles = [
            // { name: 'HogwartsRPG', color: 0 },
            { name: 'DM', color: '#6800b2' },
            { name: '---------------------', color: 10066329 },
            { name: 'Diretor', color: 7419530 },
            { name: 'Vice-diretor', color: 10181046 },
            { name: 'Chefe do Conselho Diretorial', color: 12684027 },
            { name: 'Alto Inquisitor', color: 5533306 },
            { name: 'Diretor Grifinória', color: 10420224 },
            { name: 'Diretor Sonserina', color: 221184 },
            { name: 'Diretor Corvinal', color: 12159 },
            { name: 'Diretor Lufa-Lufa', color: 8148480 },
            { name: 'Professor', color: 2123412 },
            { name: 'Adivinhação', color: 3447003 },
            { name: 'Aritmância', color: 3447003 },
            { name: 'Astronomia', color: 3447003 },
            { name: 'Defesa Contra as Artes das Trevas', color: 3447003 },
            { name: 'Estudo dos Trouxas', color: 3447003 },
            { name: 'Feitiços', color: 3447003 },
            { name: 'Herbologia', color: 3447003 },
            { name: 'História da Magia', color: 3447003 },
            { name: 'Instrução de Voo', color: 3447003 },
            { name: 'Transfiguração', color: 3447003 },
            { name: 'Trato das Criaturas Mágicas', color: 3447003 },
            { name: 'Enfermaria', color: 1357000 },
            { name: 'Enfermeiro Chefe', color: 1149336 },
            { name: 'Enfermeiro', color: 4508894 },
            { name: 'Biblioteca', color: 10038562 },
            { name: 'Bibliotecário Chefe', color: 15158332 },
            { name: 'Bibliotecário Assistente', color: 15042927 },
            { name: 'Guarda-caças', color: 11342935 },
            { name: 'Zelador', color: 7088099 },
            { name: 'Monitor-chefe', color: 10038562 },
            { name: 'Monitor Corvinal', color: 91391 },
            { name: 'Monitor Grifinória', color: 14548992 },
            { name: 'Monitor Lufa-Lufa', color: 15844367 },
            { name: 'Monitor Sonserina', color: 50693 },
            { name: 'Aluno', color: 16774656 },
            { name: 'Corvinal', color: 91391 },
            { name: 'Grifinória', color: 14548992 },
            { name: 'LufaLufa', color: 15844367 },
            { name: 'Sonserina', color: 50693 },
            { name: '----------------------', color: 10066329 },
        ]; 

        client.structure = [
            {
                name: "╭--🔹Mapa🔹--╮",
                channels: [
                    { name: "consultar-mapa", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel'], deny: ['UseApplicationCommands', 'SendMessages'], }], hasPassage: false },
                ]
            },
            {
                name: "╭--🔹Chegada🔹--╮",
                channels: [
                    { name: "caldeirão-furado", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands'], deny: ['UseApplicationCommands', 'SendMessages'], }], hasPassage: false },
                    { name: "carta-de-hogwarts", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel'], deny: ['UseApplicationCommands', 'SendMessages','AddReactions','AttachFiles'], }], hasPassage: false },
                ]
            },

            {
                name: "╭--🔹Beco Diagonal🔹--╮",
                channels: [
                    { name: "beco-diagonal", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: false },
                    { name: "banco-gringotes", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "floreios-e-borrões", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "olivaras", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "madame-malkins-roupas-para-todas-as-ocasioes", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "loja-de-caldeiroes-de-potage", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "boticario-slug-e-jiggers", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "wiseacres-wizarding-equipment", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "emporio-de-corujas-correio-corujas", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                    { name: "animais-magicos", type: 0, permissions: [{ color: "#ff0259", allow: ['ViewChannel','ReadMessageHistory'], deny: [], }], hasPassage: false },
                ]
            },

            {
                name: "╭--🔹Plataform 9 3/4🔹--╮",
                channels: [
                    { name: "expresso-de-hogwarts", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: false },
                ]
            },
    
            {
                name: "╭--🔹Exterior do Castelo🔹--╮",
                channels: [
                    { name: "jardins-de-hogwarts", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "estufas", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "torre-das-corujas", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "campo-quadribol", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-trato-criaturas-mágicas", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "aula-voo", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "lago-negro", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "floresta-proibida", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "cabana-guarda-caças", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Masmorras(Leste)🔹--╮",
                channels: [
                    { name: "corredor-da-masmorra-leste", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-comunal-sonserina", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-de-detenção", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "banheiro-da-murta-que-geme", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
            {
                name: "╭--🔹Masmorras(Oeste)🔹--╮",
                channels: [
                    { name: "corredor-da-masmorra-oeste", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-estudos-dos-trouxas", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-alquimia", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
            {
                name: "╭--🔹Piso Terreo🔹--╮",
                channels: [
                    { name: "hall-central", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "biblioteca", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "biblioteca-area-restrita", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-herbologia", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-transfiguração", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-historia-da-magia", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-poções", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 1🔹--╮",
                channels: [
                    { name: "corredor-piso-1", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "cozinha", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-comunal-lufa-lufa", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
    
                ]
            },
    
            {
                name: "╭--🔹Piso 2🔹--╮",
                channels: [
                    { name: "corredor-piso-2", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-defesa-artes-das-trevas", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
    
                ]
            },
    
            {
                name: "╭--🔹Piso 3🔹--╮",
                channels: [
                    { name: "patio-do-viaduto", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "cabana-dos-barcos", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "patio-torre-norte", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "hall-de-entrada", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "grande-salão", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "grande-escadaria-3", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "torre-do-relogio", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "patio-torre-do-relogio", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
    
                ]
            },
    
            {
                name: "╭--🔹Piso 4🔹--╮",
                channels: [
                    { name: "grande-escadaria-4", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-comunal-corvinal", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 5(Leste)🔹--╮",
                channels: [
                    { name: "grande-escadaria-5", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "corredor-piso-5-leste", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-comunal-grifinória", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
            {
                name: "╭--🔹Piso 5(Oeste)🔹--╮",
                channels: [
                    { name: "corredor-piso-5-oeste", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-aritmancia", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-encantamentos", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-adivinhação", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 7🔹--╮",
                channels: [
                    { name: "corredor-torre-do-relogio", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "banheiro-dos-prefeitos", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
    
                    { name: "corredor-piso-7", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-precisa", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 8🔹--╮",
                channels: [
                    { name: "enfermaria", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
    
                    { name: "corredor-piso-8", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-aula-astronomia", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 12🔹--╮",
                channels: [
                    { name: "observatorio", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
    
            {
                name: "╭--🔹Piso 14🔹--╮",
                channels: [
                    { name: "grande-escadaria-14", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                    { name: "sala-do-diretor", type: 2, permissions: [{ color: "#ff0259", allow: ['ViewChannel', 'Connect','Speak', 'UseApplicationCommands','SendMessages'], deny: [], }], hasPassage: true },
                ]
            },
        ];

        console.error(`!!! BOT READY !!!`);
    },
};
