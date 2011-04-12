
function saveCurrentWindow(close) {

    chrome.windows.getCurrent(function(win) {

        var name = prompt("Enter a name or keyword for this window");
        if (!name) {
            name = "Saved window"
        }

        chrome.tabs.getAllInWindow(win.id, function(win_tabs) {

            var tabs = saveTabs(win_tabs);
            var session = { name: name, time: new Date().getTime(), tabs: tabs };

            var windows = loadWindows();
            windows.unshift(session);
            localStorage.windows = JSON.stringify(windows);

            if (close) {
                chrome.windows.remove(win.id);
            }
        });

    });
    window.close();
}

function loadWindows() {
    var windows;
    if (localStorage.windows) {
        windows = JSON.parse(localStorage.windows);
    }
    if (typeof(windows) != "object") {
        windows = [];
    }
    return windows;
}

function loadSessions() {
    var sessions;
    if (localStorage.autosave_sessions) {
        sessions = JSON.parse(localStorage.autosave_sessions);
    }
    if (typeof(sessions) != "object") {
        sessions = [];
    }
    return sessions;
}

function saveTabs(wtabs) {
    var tabs = [];
    if (wtabs.length == 1 && wtabs[0].url.match("^chrome")) {
        return tabs;
    }
    for (var j = wtabs.length - 1; j >= 0; j--){
        var tab = wtabs[j];
        var t = { url: tab.url, title: tab.title, favicon: tab.favIconUrl }
        tabs.push(t);
    };
    return tabs;
}

function saveAllTabsAsSession() {

    chrome.windows.getAll( { populate: true },
        function(windows) {
            var saved = [];
            for (var i = windows.length - 1; i >= 0; i--){
                var wtabs = windows[i].tabs;
                saved.push(saveTabs(wtabs));
            };

            // store as new session
            var session = { time: new Date().getTime(), windows: saved };
            sessions.unshift(session);
            localStorage.autosave_sessions = JSON.stringify(sessions);

            // set again
            // setTimeout(saveAllTabsAsSession, saveInterval);
        }
    );
}
