const settings = require('../shared_src/settings-keys');
const storage = require('../shared_src/storage');

function unbindShortcuts() {
    try {
        window.wrappedJSObject.jQuery('.markItUpEditor').unbind('keydown.markItUp');
    } catch (e) {
        console.warn('[gwj-es] Failed to unbind keyboard shortcuts in post editor', e);
    }
}

settings.get(settings.keys.unbindEditorShortcuts).then(setting => {
    if (setting) {
        setTimeout(unbindShortcuts, 1000);
    }
}, err => console.warn('could not fetch setting', err));

storage.onChanged.addListener(changes => {
    const setting = changes[settings.keys.unbindEditorShortcuts];
    if (setting && setting.newValue) {
        unbindShortcuts();
    }
});
