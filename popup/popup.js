document.addEventListener('DOMContentLoaded', () => {
    const toggleEmails = document.getElementById('toggleEmails');
    const toggleIps = document.getElementById('toggleIps');

    chrome.storage.local.get(['hideEmails', 'hideIps'], (result) => {
        toggleEmails.checked = result.hideEmails !== false;
        toggleIps.checked = result.hideIps !== false;

        updateState();
    });

    toggleEmails.addEventListener('change', updateState);
    toggleIps.addEventListener('change', updateState);

    function updateState() {
        const settings = {
            hideEmails: toggleEmails.checked,
            hideIps: toggleIps.checked
        };

        chrome.storage.local.set(settings);

        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: "updateSettings",
                    settings: settings
                }).catch(() => { });
            }
        });
    }
});
