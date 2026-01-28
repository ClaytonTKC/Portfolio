type EventCallback = (detail?: any) => void;

class EventBus {
    private listeners: { [key: string]: EventCallback[] } = {};

    on(event: string, callback: EventCallback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: EventCallback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event: string, detail?: any) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(detail));
    }
}

export const eventBus = new EventBus();
