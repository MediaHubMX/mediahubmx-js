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

    const headers: Record<string, (string | undefined)[]> = {
      "transfer-encoding": ["identity"],
      "content-length": [undefined],
    };
    resp.headers.forEach((value, key) => {
      if (headers[key]) headers[key].push(value);
      else headers[key] = [value];
    });

    const responseHeadersLines = Object.keys(headers)
      .filter((key) => headers[key])
      .map((key) => {
        return `${key}: ${headers[key]}`;
      });

    req.once("socket", async (s) => {
      s.resume();

      const headersPayload =
        [`HTTP/1.1 ${resp.status}`, ...responseHeadersLines].join("\n") +
        "\n\n";

      const text = await resp.text();

      fakeSocket.push(headersPayload);
      fakeSocket.push(Buffer.from(text));
      fakeSocket.push(null);
    });

    return fakeSocket;
  }
}
