const settings = require('../shared_src/settings-keys');

// the list of ignored and evaporated users
var ignoreList = {
    members: [],
    vaporize: [],
    init: function() {
        return settings.multiGet([settings.keys.ignoredUsers, settings.keys.vaporizedUsers]).then(results => {
            ignoreList.members = results[settings.keys.ignoredUsers] || [];
            ignoreList.vaporize = results[settings.keys.vaporizedUsers] || [];
        });
    },
    contains: function(username) {
        return ignoreList.members.indexOf(username) > -1;
    },
    vaporized: function(username) {
        return ignoreList.vaporize.indexOf(username) > -1;
    },
    add: function(username, evap) {
        if (typeof(evap)==='undefined') {
            evap = false;
        }
        if (!ignoreList.contains(username)) {
            ignoreList.members.push(username);
            settings.set(settings.keys.ignoredUsers, ignoreList.members);
        }
        if (evap && !ignoreList.vaporized(username)) {
            ignoreList.vaporize.push(username);
            settings.set(settings.keys.vaporizedUsers, ignoreList.vaporize);
        }
    },
    remove: function(username) {
        ignoreList.members = ignoreList.members.filter(function(e){return e !== username});
        ignoreList.vaporize = ignoreList.vaporize.filter(function(e){return e !== username});
        settings.set(settings.keys.ignoredUsers, ignoreList.members);
        settings.set(settings.keys.vaporizedUsers, ignoreList.vaporize);
    },
    getRaw: function() {
        return JSON.stringify({
            members: ignoreList.members,
            vaporize: ignoreList.vaporize,
        });
    },
    setRaw: function(str) {
        try {
            var data = JSON.parse(str);
            if (!data) {
                return;
            }
            if (data.members) {
                ignoreList.members = data.members;
                settings.set(settings.keys.ignoredUsers, ignoreList.members);
            }
            if (data.vaporize) {
                ignoreList.vaporize = data.vaporize;
                settings.set(settings.keys.vaporizedUsers, ignoreList.vaporize);
            }
        } catch (e) {
        }
    },
};

const { $, $$, firstParentMatching, forEach } = require('../shared_src/utils');

/**
 * Hides an element and inserts a placeholder element before it,
 * attaching the unhide function to an anchor found in the placeholder
 *
 * @var element     the element in the document to hide
 * @var placeholder the element containing an anchor to be displayed instead
 */
function hide(element, placeholder) {
    var unhideLink = $('a', placeholder);
    if (typeof element == 'undefined') {
        return;
    }
    if (unhideLink) {
        unhideLink.addEventListener('click', unhide);
    }
    element.style.display = 'none';
    element.parentElement.insertBefore(placeholder, element);
}

function unhide() {
    this.parentElement.nextSibling.style.display = 'block';
    this.parentElement.remove();
}

// Setup placeholder elements for cloning
var unhideCommentEl = document.createElement('div');
unhideCommentEl.className = 'links ignore-placeholder';
unhideCommentEl.innerHTML = '<a class="gwj_unignore" href="javascript:void(0);">Did <span class="username"></span> Tannhauser me?</a>';
var unhideQuoteEl = document.createElement('span');
unhideQuoteEl.className = 'links bb-quote-user ignore-placeholder';
unhideQuoteEl.innerHTML = ' <a class="gwj_unignore_quote" href="javascript:void(0);">Really need to see some context?</a>';
var vaporizedCommentEl = document.createElement('div');
vaporizedCommentEl.className = 'links ignore-placeholder';
vaporizedCommentEl.innerHTML = 'This post quoted <span class="username"></span> and has been summarily vaporized.';

// hides all content on the page for a given username
function hideUserContent(name) {
    var placeholder, comment;

    // hide posts
    forEach($$("div.author-name a"), function(el) {
        if (el.textContent !== name) return;
        placeholder = unhideCommentEl.cloneNode(true);
        $('.username', placeholder).textContent = name;
        hide(firstParentMatching(el, 'forum-post'), placeholder);
    });

    if (ignoreList.vaporized(name)) {
        // hide quotes
        forEach($$("div.content div.quote-username"), function(el) {
            if (!el.textContent.match(name)) return; // match operates like .startsWith()
            // hide parent post if not written by the vaporized user
            comment = firstParentMatching(el, 'forum-post');
            if ($('div.author-name a', comment).text !== name) {
                placeholder = vaporizedCommentEl.cloneNode(true);
                $('.username', placeholder).textContent = name;
                hide(comment, placeholder);
            }// else this will already have been hidden by the previous post search
        });
    } else {
        // just hide the quotes
        forEach($$("div.content div.quote-username"), function(el) {
            if (!el.textContent.match(name)) return; // match operates like .startsWith()
            hide(el.nextSibling, unhideQuoteEl.cloneNode(true));
        });
    }
}

// create controls for ignoring and unignoring on this page
function toggleUserIgnore() {
    var username = firstParentMatching(this, 'forum-post').querySelector('div.author-name a').text;
    if (ignoreList.contains(username)) {
        ignoreList.remove(username);
        this.parentElement.parentElement.removeChild(this.parentElement);
        if (confirm('Reload the page to show all posts from '+username+'?')) {
            document.location.reload();
        }
    } else {
        ignoreList.add(username, confirm(
            "Click OK to adopt a zero tolerance policy. (If you accept, all posts with any quotes attributing "+username+" will also be hidden.)"
        ));
        hideUserContent(username);
        this.innerHTML = 'unignore';
    }
}

var ignorePosterItem = document.createElement('li');
ignorePosterItem.classList.add('post-ignore');
ignorePosterItem.innerHTML = '<a href="javascript:void(0);"></a>';

// insert a brief stylesheet for our created elements
var style = document.createElement('style');
style.innerHTML = '\
.ignore-placeholder { font-weight: bold; } \
div.ignore-placeholder { margin: 1em; } \
.forum-post .meta-links .post-actions ul li.post-ignore a { \
width: 16px; height: 13px; \
background-position: center center; background-repeat: no-repeat; \
background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jaWSMUtcURCFD2KRyjogsqu+OyOEEETenem2jP6FBUFR/4G7lQGbmCJYWKmgv2Wx2LC5M1Za2dkolnZi8yzeZnn70Bg2A7c7353DmQNMMAPJZlzD3iRsCQsNXGjwX/BAspk3hf3l+YbH0LbIXYuh4zG0U559ehdOedYyoQtXLl59b8H7wJRFOqyIL5OEXRf2OpxyXnXhn/vA1OgDEz535cKETk34/tcXmgUAX6GlKuwaxIWPSi2fl7aVdoaiAwBw4WdfWfhcD8yU1kzosdTQgSsXSWkHLnzjwnc9YBoATPnKlR5M6LoKu9KTKV8BQA+YNuF7F74ZOTCl7wCQJGxWbf+By41hY+jghysXHmm7lgGfVG2nnFdd6cmFn134W6/Z/GBCp8OFZ+NXUD4eT7v50YTWLfLW75h9tRg6rnzryoVFOhy7Qj2w0eZaD0zoIuVZ6916pnxxrmxi6FjkrsfQ7i/PN15t3z91+2/jGvYmhgG8AGJ1AV5Z7OaYAAAAAElFTkSuQmCC\'); \
}';

// inserts the ignore/unignore link into a ul.links element
function addIgnoreLink(el) {
    var listItem = ignorePosterItem.cloneNode(true);
    el.insertBefore(listItem, el.lastElementChild);
    var link = $('a', listItem);
    var username = firstParentMatching(el, 'forum-post').querySelector('div.author-name a');
    link.addEventListener('click', toggleUserIgnore);
    if (username && ignoreList.contains(username.text)) {
        link.title = link.text = 'Unignore this author';
    } else {
        link.title = link.text = 'Ignore this author';
    }
}

const getOrCreateScriptsMenu = require('../shared_src/scriptsMenu').getOrCreateScriptsMenu;

function addImportExportMenu() {
    var scriptsMenu = getOrCreateScriptsMenu();
    var threadIgnoreMenuItem = document.createElement('li');
    var linkTemplate = document.createElement('a');
    linkTemplate.href = '#';

    var importExportLink = linkTemplate.cloneNode(true);
    importExportLink.innerHTML = 'Import/Export';
    importExportLink.addEventListener('click', function(e) {
        e.preventDefault();
        var response = window.prompt(
            'Here is the current database of ignored posters. You may paste in a different one to restore from a backup.',
            ignoreList.getRaw()
        );

        switch (response) {
            case null:
                return;

            case "":
                response = '{"members":[],"vaporize":[]}';

            default:
                ignoreList.setRaw(response);
        }
    });

    threadIgnoreMenuItem.appendChild(document.createTextNode('User Ignore '));
    threadIgnoreMenuItem.appendChild(importExportLink);
    scriptsMenu.appendChild(threadIgnoreMenuItem);
}


function goTime() {
    ignoreList.init().then(() => {
        addImportExportMenu();

        // https://www.gamerswithjobs.com/node/*
        if (window.location.pathname.match(/^\/node\//)) {
            // add our stylesheet
            $('head').appendChild(style);

            // loop over all currently ignored users
            forEach(ignoreList.members, hideUserContent);

            // add ignore buttons to all posts
            forEach($$('.forum-post .meta-links .post-actions ul'), addIgnoreLink);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", goTime);
} else {
    goTime();
}
