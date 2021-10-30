import { Context } from '../../../types';

export default interface User {
  getUserInfo: (ctx: Context) => Promise<void>;
}
