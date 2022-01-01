export type Storage<T> = {
  [id: string]: T;
};

export default class BaseStore<T> {
  public constructor(protected storage: Storage<T> = {}) {}

  public getStorage(): Storage<T> {
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

  public removeById(id: string): T | undefined {
    const item = this.storage[id];
    delete this.storage[id];
    return item;
  }
}
