export default class GameObserver {
    constructor() {
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    notify(gameEvent, props) {
        this.listeners.forEach(listener => {
            listener.notify(gameEvent, props);
        });
    }
}

