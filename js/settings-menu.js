let settings = {};


window.onload = function() {   
    settings = { ...DEFAULT_SETTINGS };
    
    // Listen for input events to adjust the text in realtime.    
    document.getElementById('scroll-interval').addEventListener('input', updateScrollIntervalValue);
    document.getElementById('scroll-distance').addEventListener('input', updateScrollDistanceValue);
    document.getElementById('scroll-speed').addEventListener('input', updateScrollSpeedValue);

    // Load Settings
    moduleLoadSettings()
        .then(loadedSettings => {
            settings = { ...loadedSettings };
            updateSettingsUI();
        })
        .catch(error => {
            updateSettingsUI();
        });
    
    // Listen for changed settings.
    document.getElementById('scroll-interval').addEventListener('change', (event) => {
        settings.interval = parseFloat(getScrollIntervalValue());
        moduleSaveSettings(settings);
    });

    document.getElementById('scroll-distance').addEventListener('change', (event) => {
        settings.distance = parseInt(getScrollDistanceValue());
        moduleSaveSettings(settings);
    });

    document.getElementById('scroll-speed').addEventListener('change', (event) => {
        settings.speed = parseFloat(getScrollSpeedValue());
        moduleSaveSettings(settings);
    });

    // Reset - Button
    document.getElementById('button-reset').addEventListener('click', (event) => {
        settings = { ...Settings.DEFAULT_SETTINGS };
        updateSettingsUI();
        moduleSaveSettings(settings);
    });
}


// Updates the displayed labels for all sliders to match the sliders current values.
function updateSettingsUI() {
    setScrollInterval(settings.interval);
    setScrollDistance(settings.distance);
    setScrollSpeed(settings.speed);
}


// SCROLL INTERVAL
function updateScrollIntervalValue() {
    const label = document.getElementById('scroll-interval-value');        
    const value = parseFloat(getScrollIntervalValue());
    label.innerHTML = value.toFixed(1) + " Seconds";
}

function setScrollInterval(interval) {    
    document.getElementById('scroll-interval').value = interval;
    updateScrollIntervalValue();    
}

function getScrollIntervalValue() {
    return document.getElementById('scroll-interval').value;
}


// SCROLL DISTANCE
function updateScrollDistanceValue() {
    const label = document.getElementById('scroll-distance-value');
    const value = parseInt(getScrollDistanceValue());
    label.innerHTML = value + "%";
}

function setScrollDistance(distancePercent) {
    document.getElementById('scroll-distance').value = distancePercent;
    updateScrollDistanceValue();
}

function getScrollDistanceValue() {    
    return document.getElementById('scroll-distance').value;
}


// SCROLL SPEED
function updateScrollSpeedValue() {
    const label = document.getElementById('scroll-speed-value');
    const value = parseFloat(getScrollSpeedValue());
    label.innerHTML = value.toFixed(1) + " Seconds";
}

function setScrollSpeed(speed) {
    document.getElementById('scroll-speed').value = speed;
    updateScrollSpeedValue();
}

function getScrollSpeedValue() {    
    return document.getElementById('scroll-speed').value;
}