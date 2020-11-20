import { Context } from "../types";

type ResponseBody = {
  ok?: boolean;
  msg?: string;
  [ key: string ]: any
};

export default class BaseController {

  protected clientReturn( ctx: Context, others: ResponseBody = {} ): void {
    ctx.body = {
      ok: true,
      ...others
    };
  }

  protected clientReject( ctx: Context, msg: string ) {
    this.clientReturn( ctx, {
      ok: false,
      msg
    } );
  }

  protected clientReturnOk( ctx: Context ) {
    this.clientReturn( ctx );
  }
}