import { Agent, ClientRequest, RequestOptions } from "agent-base";
import * as net from "net";
import { ActionHandlerContext } from "../types";

/**
 * Experimental: can be used basically for GET or POST (with JSON payload)
 * More complex requests can cause issues
 */
export class FetchAgent extends Agent {
  constructor(private fetchFn: ActionHandlerContext["fetch"]) {
    super();
  }

  async callback(
    req: ClientRequest,
    opts: RequestOptions
  ): Promise<net.Socket> {
    const fakeSocket = new net.Socket({ writable: false });
    fakeSocket.readable = true;

    const url: string =
      (<any>opts).href ||
      `${req.protocol}//${(<any>req).auth || ""}${req.host}${req.path}`;
    const resp = await this.fetchFn(url, {
      method: opts.method || "GET",
      body: (<any>opts).body,
      headers: (opts.headers || {}) as { [key: string]: string },
    });

    const headers: string[] = [];
    resp.headers.forEach((value, key) => {
      if (value) headers.push(`${key.trim()}: ${value.trim()}`);
    });
    headers.push("", "");

    req.once("socket", async (s) => {
      s.resume();

      fakeSocket.push([`HTTP/1.1 ${resp.status}`, ...headers].join("\r\n"));
      fakeSocket.push(Buffer.from(await resp.text()));
      fakeSocket.push(null);
    });

    return fakeSocket;
  }
}
