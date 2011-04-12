
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
