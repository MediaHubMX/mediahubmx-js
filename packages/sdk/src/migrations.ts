import { Addon, AddonRequest, AddonResponse } from "@mediahubmx/schema";
import semver from "semver";
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

      if (ctx.clientVersion && semver.lt(ctx.clientVersion, "1.2.12")) {
        if (addon.catalogs) {
          for (const catalog of addon.catalogs) {
            const itemTypes = catalog.itemTypes as any;
            if (catalog.itemTypes) {
              catalog.kind =
                itemTypes?.length === 1 && itemTypes[0] === "iptv"
                  ? "iptv"
                  : "vod";
              delete catalog.itemTypes;
            }
          }
        }
      }

      return addon;
    },
  },
};
