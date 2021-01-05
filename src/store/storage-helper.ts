export interface IStorageItem {
    key: string;
    value: any;
}

export class StorageItem {
    key: string;
    value: any;

    constructor(data: IStorageItem) {
        this.key = data.key;
        this.value = data.value;
    }
}

// class for working with local storage in browser (common that can use other classes for store some data)
export class LocalStorageWorker {
    private static localStorageSupported: boolean = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
    
    // add value to storage
    static add(key: string, item: any) {
        if (this.localStorageSupported) {
            localStorage.setItem(key, JSON.stringify(item));
        }
    }

    // get all values from storage (all items)
    static getAllItems(): Array<StorageItem> {
        const list = new Array<StorageItem>();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            const value = localStorage.getItem(key);

            list.push(new StorageItem({
                key: key,
                value: value
            }));
        }

        return list;
    }

    // get only all values from localStorage
    static getAllValues(): Array<any> {
        const list = new Array<any>();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            const value = localStorage.getItem(key);

            list.push(value);
        }

        return list;
    }

    // get one item by key from storage
    static get<T>(key: string): T {
        if (this.localStorageSupported) {
            const stringItem = localStorage.getItem(key);
            if (stringItem == null) return null!;

            const item = JSON.parse(stringItem) as T;
            return item;
        } else {
            return null!;
        }
    }

    // remove value from storage
    static remove(key: string) {
        if (this.localStorageSupported) {
            localStorage.removeItem(key);
        }
    }

    // clear storage (remove all items from it)
    static clear() {
        if (this.localStorageSupported) {
            localStorage.clear();
        }
    }
}
