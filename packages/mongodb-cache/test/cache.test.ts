import jest from "@jest/globals";
import { testCache } from "@mediahubmx/cache";
import { MongodbCache } from "../src";

if (process.env.MONGODB_URL) {
  testCache("mongodb", () => new MongodbCache(<string>process.env.MONGODB_URL));
} else {
  jest.describe("MongodbCache", () => {
    jest.test("noop", () => {});
  });
}
