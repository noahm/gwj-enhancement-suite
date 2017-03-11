const settings = require('../shared_src/settings-keys');
const storage = require('../shared_src/storage');

function saveOption(e) {
    const input = e.target;
    let value;
    switch (input.type) {
        case "checkbox":
            value = input.checked;
            break;
        case "radio":
            // input.checked = input.value === savedSetting;
            // break;
        default:
            value = input.value;
    }
    settings.set(input.id, value);
}

function restoreOptions() {
    storage.get().then(savedSettings => {
        for (const key in settings.keys) {
            const input = document.querySelector('#' + settings.keys[key]);
            if (!input) {
                console.warn('Could not find input field for setting', key);
                continue;
            }
            const savedSetting = savedSettings[settings.keys[key]]
            switch (input.type) {
                case "checkbox":
                    input.checked = !!savedSetting;
                    break;
                case "radio":
                    input.checked = input.value === savedSetting;
                    break;
                default:
                    input.value = savedSetting;
            }
            input.addEventListener('change', saveOption);
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", e => e.preventDefault());
