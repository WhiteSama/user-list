class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const removeIndex = this.observers.findIndex(obs => {
            return observer === obs;
        });

        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }

    notify(data, target) {
        if (this.observers.length > 0) {
            this.observers.forEach(observer => {
                if (target) {
                  if (observer.name === target) {
                        observer.update(data)
                    }
                } else {
                    observer.update(data)
                }
            });
        }
    }
}

export default Subject;
