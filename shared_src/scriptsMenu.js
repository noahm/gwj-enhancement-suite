const { $ } = require('./utils');

// insert user scripts menu column, if necessary
function getOrCreateScriptsMenu() {
    var userMenu = $('#wc-header-user-dropdown-content');
    var scriptsMenu = $('#noahm-scripts-menu');
    if (userMenu && !scriptsMenu) {
        var div = document.createElement('div');
        div.classList.add('block', 'block-wc-header');
        div.innerHTML = '<h2>Your scripts</h2><div class="content"><div class="item-list"><ul id="noahm-scripts-menu"></ul></div></div>';
        userMenu.appendChild(div);
    }
    return scriptsMenu || $('#noahm-scripts-menu');
}

module.exports = {
    getOrCreateScriptsMenu
};
