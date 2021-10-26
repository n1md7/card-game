type Storage<T> = {
  [id: string]: T;
};

export { Storage };

export default class BaseStore<T> {
  protected storage: Storage<T> = {};

  public constructor(defaultStorageData: Storage<T> = {}) {
    this.storage = defaultStorageData;
  }

  public getStorage() {
    return this.storage;
  }

  public clearStorage(): void {
    this.storage = {};
  }

  public setById(id: string, item: T): T {
    return (this.storage[id] = item);
  }

  // does exactly same as setById 😁
  public updateById(id: string, item: T): T {
    return this.setById(id, item);
  }

  public getById(id: string): T | undefined {
    return this.storage[id];
  }
}
