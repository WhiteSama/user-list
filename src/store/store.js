import Subject from './subject';

class Store extends Subject {
    constructor() {
        super();
        this.store = {};
    }

    update(data = {}, target) {
        this.store = Object.assign(this.store, data);
        this.notify(this.store, target);
    }

    get(prop) {
        if (prop) return this.store[prop];
        return this.store;
    }
}

export default Store;
