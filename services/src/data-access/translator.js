const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

async function translateText(text) {
    let [translations] = await translate.translate(text, {
        from: 'no',
        to: 'en'
    });
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
}

module.exports = {
    translateText: translateText
}