import jest from "@jest/globals";
import { createAddon, createApp } from "../src";

const exported = [createApp, createAddon];

jest.test("SDK should export all needed methods and properties", () => {
  jest.expect(exported.every((fn) => fn)).toBeTruthy();
});
