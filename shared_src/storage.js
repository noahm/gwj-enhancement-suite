let storagePromise = new Promise((resolve, reject) => {
    if (!browser.storage.sync) {
        resolve(browser.storage.local);
    }
    browser.storage.sync.set({}).then(success => browser.storage.sync, failure => {
        console.info('[gwj-es] sync storage rejected an empty set, falling back to local storage');
        return browser.storage.local;
    }).then(result => resolve(result));
});

const storage = {
    get: function(keyOrKeys) {
        return storagePromise.then(storage => storage.get(keyOrKeys));
    },
    set: function(keyOrKeys) {
        return storagePromise.then(storage => storage.set(keyOrKeys));
    },
    onChanged: browser.storage.onChanged,
};

module.exports = storage;
