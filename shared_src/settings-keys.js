const storage = require('./storage');
const keys = {
    unbindEditorShortcuts: "unbind-editor-shortcuts",
    showSpoilerToggle: "show-spoiler-toggle",
    ignoredUsers: "ignoredUsers",
    vaporizedUsers: "vaporizedUsers",
};

module.exports = {
    get: function(key, def) {
        return storage.get(key).then(result => result[key] === undefined ? def : result[key]);
    },
    multiGet: (keys) => storage.get(keys),
    set: function(key, val) {
        return storage.set({ [key]: val });
    },
    keys: keys,
    onChange: (key, cb) => {
        storage.onChanged.addListener(changes => {
            if (changes.hasOwnProperty(key)) {
                cb(changes[key].newValue, changes[key].oldValue);
            }
        });
    }
};
