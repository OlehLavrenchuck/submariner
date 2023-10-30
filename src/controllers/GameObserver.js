export default class GameObserver {
    constructor() {
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify(gameEvent, props) {
        this.listeners.forEach(listener => {
            listener.notify(gameEvent, props);
        });
    }
}

