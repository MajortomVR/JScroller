// Default Settings
const DEFAULT_SETTINGS = {
    interval: 2.0,
    distance: 80,
    speed: 0.2
}

/**
 * Saves the settings in Chrome's local storage.
 * @param {Object} settings in the form of DEFAULT_SETTINGS.
 */
function moduleSaveSettings(settings) {
    chrome.storage.local.set(settings, function() {
        console.log("Settings saved! " + JSON.stringify(settings));
    });    
}

/**
 * Load settings from Chrome's local storage.
 * @returns {Promise<Object>} settings in the form of DEFAULT_SETTINGS.
 */
function moduleLoadSettings() {        
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function(data) {
            let settings = {...DEFAULT_SETTINGS};

            settings.interval = data.interval ?? DEFAULT_SETTINGS.interval;
            settings.distance = data.distance ?? DEFAULT_SETTINGS.distance;
            settings.speed = data.speed ?? DEFAULT_SETTINGS.speed;

            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {

                resolve(settings);
            }
        });
    });
}