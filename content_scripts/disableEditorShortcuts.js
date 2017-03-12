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
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", unbindShortcuts);
    } else {
        unbindShortcuts();
    }
}, err => console.warn('could not fetch setting', err));

settings.onChange(settings.keys.unbindEditorShortcuts, newValue => {
    if (newValue) {
        unbindShortcuts();
    }
});
