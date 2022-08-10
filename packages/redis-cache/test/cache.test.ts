import jest from "@jest/globals";
import { testCache } from "@mediahubmx/cache";
import { RedisCache } from "../src";

if (process.env.REDIS_URL) {
  testCache(
    "redis",
    () => new RedisCache({ url: <string>process.env.REDIS_URL })
  );
} else {
  jest.describe("RedisCache", () => {
    jest.test("noop", () => {});
  });
}
