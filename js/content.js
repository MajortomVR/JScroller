
class AutoScroll {
    static FRAMES_PER_SECOND = 60;

    constructor() {
        this.settings = {...DEFAULT_SETTINGS};
        
        this.interval = null;
        this.smoothInterval = null;
        this.speedPixelPerSecond = 0.0;
        this.distanceRemaining = 0;
        this.distance = 0;
        this.lastTimestamp = 0;

        this.listeners = [];
    }

    updateSettings(updatedSettings) {
        this.settings = {...updatedSettings};

        if (this.isActive()) {
            this.start();
        }
    }

    isActive() {
        return this.interval != null;
    }

    addStateChangedListener(listener) {
        this.listeners.push(listener);
    }

    start() {
        this.stop();
        this.interval = setInterval(() => this.#scrollDown(), Math.round(this.settings.interval * 1000));        
        this.#emitEvent();        
    }

    stop() {
        if (this.smoothInterval) {
            clearInterval(this.smoothInterval);
            this.smoothInterval = null;
        }

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.#emitEvent();
    }

    #scrollDown() {
        const height = window.innerHeight;
        
        const distanceToScroll = height * (this.settings.distance / 100.0);
        this.speedPixelPerSecond = distanceToScroll / this.settings.speed;
        this.distanceRemaining = distanceToScroll;
        this.distance = 0;

        if (!this.smoothInterval) {
            this.smoothInterval = setInterval(() => this.#smoothScroll(), 1000 / AutoScroll.FRAMES_PER_SECOND);
            this.lastTimestamp = performance.now();
        }        
    }

    #smoothScroll() {
        let deltaTime = (performance.now() - this.lastTimestamp) / 1000.0;
        
        this.distance += this.speedPixelPerSecond * deltaTime;        
        const distanceMoved = Math.trunc(this.distance);

        this.distance -= distanceMoved;
        this.distanceRemaining -= distanceMoved;
        
        if (this.distanceRemaining <= 1) {
            clearInterval(this.smoothInterval);
            this.smoothInterval = null;
        }
        
        window.scrollBy(0, distanceMoved);

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
            console.log("Scrolling stopped -> end reached!");
            this.stop();            
        }

        this.lastTimestamp = performance.now();
    }

    #emitEvent() {
        this.listeners.forEach(listener => listener());
    }
}


class Button {
    constructor(autoScrollInstance) {
        this.autoScrollInstance = autoScrollInstance;
    }

    get() {
        return document.getElementById('button-autoscroll-jscroll');
    }

    create() {
        // If we can't find the button try to create it
        if (!this.get()) {
            const button = document.createElement('button');

            if (button) {
                button.id = 'button-autoscroll-jscroll';
                button.innerText = '';

                document.body.appendChild(button);

                this.autoScrollInstance.addStateChangedListener( this.updateText.bind(this) );
                
                button.addEventListener('click', () => {
                    if (this.autoScrollInstance.isActive()) {
                        this.autoScrollInstance.stop();
                    } else {
                        this.autoScrollInstance.start();
                    }
                });

                this.updateText();
            }
        }        
    }

    updateText() {
        const button = this.get();

        if (button) {
            button.innerText = this.autoScrollInstance.isActive() ? 'Stop Autoscroll' : 'Start Autoscroll';
        }
    }
}




const autoScroll = new AutoScroll();
const button = new Button(autoScroll);


window.onload = () => {
    loadSettings();
    
    // Show the button after the extension icon was pressed.
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'showButton') {
            button.create();
        }
    });

    // Update Settings
    chrome.storage.onChanged.addListener((changes) => loadSettings());
}


// Loads the extensions settings
function loadSettings() {
    moduleLoadSettings()
        .then(loadedSettings => {
            autoScroll.updateSettings(loadedSettings);
        })
        .catch(error => {
            console.log('Error loading settings.');
            autoScroll.updateSettings(...DEFAULT_SETTINGS);
        });
}