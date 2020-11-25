import BaseStore from "../store/BaseStore";

export default abstract class BaseModel<T> {
  protected store: BaseStore<T>;

  public constructor( store: BaseStore<T> ) {
    this.store = store;
  }

  public setById( id: string, item: T ): T {
    return this.store.setById( id, item );
  }

  public getById( id: string ): T | undefined {
    return this.store.getById( id );
  }
}