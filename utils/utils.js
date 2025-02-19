const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
// Load our library that generates the document
const Docxtemplater = require("docxtemplater");
// Load PizZip library to load the docx/pptx/xlsx file in memory
const PizZip = require("pizzip");

/***********************************/
const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))
const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

const template_file = {
    'Grifinória': 'template_g',
    'Sonserina': 'template_s',
    'Corvinal': 'template_r',
    'Lufa-Lufa': 'template_h'
}
/***********************************/
function generateUUID() {
    return uuidv4();
}
/***********************************/

function StringFormat(str, ...args) {
    if (args && args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            str = str.replace(`{${i}}`, args[i])
        }
    }
    return str
}

function RemoveSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}


function FichaToWord(username, id) {

    let file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(username)}_${id}.json`, 'utf8');
    const ficha_player = JSON.parse(file)
    file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(username)}_${id}.json`, 'utf8');
    const player_inv = JSON.parse(file)

    // Load the docx file as binary content
    const content = fs.readFileSync(path.resolve('./RPGData/template_ficha', `${template_file[ficha_player.house]}.docx`), "binary");

    // Unzip the content of the file
    const zip = new PizZip(content);

    /*
    * Parse the template.
    * This function throws an error if the template is invalid,
    * for example, if the template is "Hello {user" (missing closing tag)
    */
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    /*
    * Render the document : Replaces :
    * - {first_name} with John
    * - {last_name} with Doe,
    * ...
    */
    ficha_player.PV = `${ficha_player['PV']} / ${ficha_player['PVMax']}`
    ficha_player.PM = `${ficha_player['PM']} / ${ficha_player['PMMax']}`
    ficha_player.spells = ficha_player['spells'].map(spell => spell_list[spell].name).join('\n')
    ficha_player.vantagens = ficha_player['vantagens'].map(vantagem => vantagem_list[vantagem].label).join('\n')
    ficha_player.desvantagens = ficha_player['desvantagens'].map(desvantagem => desvantagem_list[desvantagem].label).join('\n')
    ficha_player.inventario = Object.values(player_inv.inventario).map(item => `${item.amount} x ${item.name}`).join('\n')
    doc.render(ficha_player);

    /*
    * Get the document as a zip (docx are zipped files)
    * and generate it as a Node.js buffer
    */
    const buf = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE", });

    // fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
    const filePathDoc = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(username)}_${id}.docx`);
    fs.writeFileSync(filePathDoc, buf);

    return
}

async function FichaToPDF(username, id) {
    FichaToWord(username, id)

    const filePathPdf = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(username)}_${id}.pdf`);
    const docxBuf = fs.readFileSync(`./tempdata/ficha_${RemoveSpecialCharacters(username)}_${id}.docx`);
    let pdfBuf = await libre.convertAsync(docxBuf, 'pdf', undefined);
    fs.writeFileSync(filePathPdf, pdfBuf);
    return
}

async function importImage(imageUrl, username, id) {
    const config = require('../config.json');
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imagePath = path.join('./tempdata/', `img_${RemoveSpecialCharacters(username)}_${id}_${generateUUID()}.jpg`);
    fs.writeFileSync(imagePath, buffer);

    const url = 'https://api.fivemanage.com/api/image';

    const formData = new FormData();

    formData.append('file', fs.createReadStream(imagePath));
    formData.append("metadata", JSON.stringify({
        name: `Varinha ${RemoveSpecialCharacters(username)} ${id}`,
        description: `Varinha de ${username} #${id}`,
    }));

    try {
        const result = await axios.post(url, formData, {
            headers: {
                Authorization: config.FIVEMANAGE_API_KEY,
                ...formData.getHeaders()
            }
        })

        fs.unlinkSync(imagePath);
        return result.data.url
    } catch (error) {
        console.error(error)
        fs.unlinkSync(imagePath);
        return null
    }
}

module.exports = {
    StringFormat,
    RemoveSpecialCharacters,
    FichaToWord,
    FichaToPDF,
    importImage
};
