// import { promises as fsPromises } from "fs";
// import * as os from "os";
// import * as path from "path";
// import { DiskCache } from "../src/engines/disk";
import jest from "@jest/globals";
import { MemoryCache } from "../src/engines/memory";
import { testCache } from "../src/utils/test-utils";

jest.describe(`MemoryCache`, () => {
  testCache("memory", () => new MemoryCache());
});

// describe(`DiskCache`, () => {
//   const tempPath = path.join(os.tmpdir(), "mediahubmx-sdk-test-");
//   testCache(
//     "disk",
//     async () => new DiskCache(await fsPromises.mkdtemp(tempPath))
//   );
// });
