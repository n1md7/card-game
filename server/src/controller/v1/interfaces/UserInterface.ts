import { Context } from '../../../types';

export default interface UserInterface {
  getUserInfo: (ctx: Context) => Promise<void>;
}
