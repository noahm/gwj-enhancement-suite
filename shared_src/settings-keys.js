const storage = require('./storage');
const keys = {
    unbindEditorShortcuts: "unbind-editor-shortcuts",
};

module.exports = {
    get: function(key) {
        return storage.get(key).then(result => result[key]);
    },
    set: function(key, val) {
        return storage.set({ [key]: val });
    },
    keys: keys,
};
