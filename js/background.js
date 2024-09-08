// Create a settings entry in the context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'settings-menu',
        title: 'Settings',
        contexts: ['action']
    });
});

// Create the settings window when the contextmenu entry is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'settings-menu') {
        chrome.windows.create({
            url: 'html/settings.html',
            type: 'popup',
            width: 400,
            height: 500
        });
    }
});

// On left click show the button on the page
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'showButton' });
});