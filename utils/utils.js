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

module.exports = {
    StringFormat,
    RemoveSpecialCharacters
};
