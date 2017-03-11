try {
    require('webextension-polyfill');

    // include all components
    require('./disableEditorShortcuts');
    require('./spoilerToggle');
    require('./userIgnore');

} catch (e) {
    console.error('[gwj-es] runtime error in extension code', e);
}
