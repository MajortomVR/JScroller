let interval = null;
let smoothInterval = null;
let distanceRemaining = 0;
let distance = 0;
let lastTimestamp = 0;

let settings = {...DEFAULT_SETTINGS};


window.onload = () => {
    loadSettings();
    
    // Show the button after the extension icon was pressed.
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'showButton') {
            if (!getButton()) {
                createButton();
            }
        }
    });

    // Update Settings
    chrome.storage.onChanged.addListener((changes) => {
        loadSettings();
    });
}

// Creates a button to control autoscroll start/stop
function createButton() {
    const button = document.createElement('button');
    button.id = 'button-autoscroll-jscroll';
    button.innerText = '';    

    document.body.appendChild(button);
    
    updateButtonText();

    button.addEventListener('click', () => {
        toggleScrolling();
        updateButtonText();
    });
}

// Loads the extensions settings
function loadSettings() {
    moduleLoadSettings()
        .then(loadedSettings => {
            settings = {...loadedSettings};
            
            if (getStateAutoScroll()) {
                startScrolling();
            }
        })
        .catch(error => {
            console.log('Error loading settings.');
        });
}

// Return the Start/Stop Autoscrolling button
function getButton() {
    return document.getElementById('button-autoscroll-jscroll');
}

// Update the button's text depending on the current state
function updateButtonText() {
    const button = getButton();

    if (button) {
        button.innerText = getStateAutoScroll() ? 'Stop Autoscroll' : 'Start Autoscroll';
    }
}

// Returns the state of Auto Scrolling.
function getStateAutoScroll() {
    return (interval !== null);
}

// Toggles Auto Scrolling ON/OFF
function toggleScrolling() {    
    if (interval) {
        stopScrolling();
    } else {
        startScrolling();
    }
}

// Call to start Auto Scrolling.
function startScrolling() {
    stopScrolling();
    interval = setInterval(scrollDown, Math.round(settings.interval * 1000));
    updateButtonText();
}

// Stops Auto Scrolling.
function stopScrolling() {
    if (smoothInterval) {
        clearInterval(smoothInterval);
        smoothInterval = null;
    }
    if (interval) {
        clearInterval(interval);
        interval = null;
    }    
    
    updateButtonText();
}

// Called in intervals to scroll down smoothly.
function scrollDown() {
    const height = window.innerHeight;
    distanceRemaining = height * (settings.distance / 100.0);
    distance = 0;
    
    if (!smoothInterval) {
        smoothInterval = setInterval(smoothScroll, 1000 / 30);
        lastTimestamp = Date.now();
    } 
}

// Called for a smooth scrolling animation.
function smoothScroll() {
    let deltaTime = (Date.now() - lastTimestamp) / 1000.0;
    deltaTime = Math.min(0.1, deltaTime);

    distance += distanceRemaining * (1.0 / settings.speed) * deltaTime;
    distanceRemaining -= distance;

    if (distanceRemaining <= 1) {
        clearInterval(smoothInterval);
        smoothInterval = null;
    }

    const lastPositionY = window.scrollY;
    window.scrollBy(0, distance);

    if (window.scrollY === lastPositionY && distance >= 1) {
        console.log("Scrolling stopped -> end reached!");
        stopScrolling();
    }

    lastTimestamp = Date.now();
}