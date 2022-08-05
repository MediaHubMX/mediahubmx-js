import { Addon, AddonRequest, AddonResponse } from "@mediahubmx/schema";
import { AddonClass } from "./addon";
import { ActionHandlerContext } from "./types";

const sdkVersion: string = require("../package.json").version;

export type MigrationContext = {
  clientVersion: null | string;
  addon: AddonClass;
  data: any;
  user: ActionHandlerContext["user"];
  validator: {
    request: (obj: any) => any;
    response: (obj: any) => any;
  };
};

export const migrations = {
  addon: {
    response(
      ctx: MigrationContext,
      input: AddonRequest,
      output: AddonResponse
    ) {
      const addon = <Addon>output;
      const any = <any>addon;
      if (any.type !== "server") {
        any.sdkVersion = sdkVersion;
      }
      return addon;
    },
  },
};
