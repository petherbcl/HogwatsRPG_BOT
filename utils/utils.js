function StringFormat(str, ...args) {
    if (args && args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            str = str.replace(`{${i}}`, args[i])
        }
    }
    return str
}

module.exports = {
    StringFormat
};
