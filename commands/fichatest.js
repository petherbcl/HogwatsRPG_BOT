// const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
// const fs = require('fs');
// const path = require('path');
// const libre = require('libreoffice-convert');
// libre.convertAsync = require('util').promisify(libre.convert);

// // Load our library that generates the document
// const Docxtemplater = require("docxtemplater");
// // Load PizZip library to load the docx/pptx/xlsx file in memory
// const PizZip = require("pizzip");

// const { RemoveSpecialCharacters } = require("../utils/utils");

// const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
// const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))
// const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

// const template_file={
//     'Grifinória': 'template_g',
//     'Sonserina': 'template_s',
//     'Corvinal':'template_r',
//     'Lufa-Lufa': 'template_h'
// }


// module.exports = {
//     dm: true,
//     data: new SlashCommandBuilder()
//         .setName('fichatest')
//         .setDescription('fichatest.'),
//     async execute(interaction, client) {
//         await interaction.deferReply({ ephemeral: true }).catch( () => {} );

//         const guild = client.guilds.cache.get(interaction.guildId);
//         const member = guild.members.cache.get(interaction.user.id);
//         // const user = interaction.user;
//         // const channel = interaction.channel;

//         let file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
//         const ficha_player = JSON.parse(file)
//         file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
//         const player_inv = JSON.parse(file)

//         // Load the docx file as binary content
//         const content = fs.readFileSync(path.resolve('./RPGData/template_ficha', `${template_file[ficha_player.house]}.docx`), "binary");

//         // Unzip the content of the file
//         const zip = new PizZip(content);

//         /*
//         * Parse the template.
//         * This function throws an error if the template is invalid,
//         * for example, if the template is "Hello {user" (missing closing tag)
//         */
//         const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

//         /*
//         * Render the document : Replaces :
//         * - {first_name} with John
//         * - {last_name} with Doe,
//         * ...
//         */
//         ficha_player.PV = `${ficha_player['PV']} / ${ficha_player['PVMax']}`
//         ficha_player.PM = `${ficha_player['PM']} / ${ficha_player['PMMax']}`
//         ficha_player.spells = ficha_player['spells'].map(spell => spell_list[spell].name).join('\n')
//         ficha_player.vantagens = ficha_player['vantagens'].map(vantagem => vantagem_list[vantagem].label).join('\n')
//         ficha_player.desvantagens = ficha_player['desvantagens'].map(desvantagem => desvantagem_list[desvantagem].label).join('\n')
//         ficha_player.inventario = Object.values(player_inv.inventario).map( item => `${item.amount} x ${item.name}`).join('\n')
//         doc.render(ficha_player);

//         /*
//         * Get the document as a zip (docx are zipped files)
//         * and generate it as a Node.js buffer
//         */
//         const buf = doc.getZip().generate({type: "nodebuffer",compression: "DEFLATE",});

//         // fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
//         const filePathDoc = path.join('./tempdata/', `test_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.docx`);
//         fs.writeFileSync(filePathDoc, buf);


//         const filePathPdf = path.join('./tempdata/', `test_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.pdf`);
//         const docxBuf = fs.readFileSync(`./tempdata/test_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.docx`);
//         let pdfBuf = await libre.convertAsync(docxBuf, 'pdf', undefined);
//         fs.writeFileSync(filePathPdf, pdfBuf);

//         fs.unlinkSync(filePathDoc);

//         const attachment = new AttachmentBuilder(filePathPdf);
//         await interaction.editReply({ files: [attachment], ephemeral: true });

//         // // Remover o arquivo temporário após o envio
//         fs.unlinkSync(filePathPdf);

//     },
// };
