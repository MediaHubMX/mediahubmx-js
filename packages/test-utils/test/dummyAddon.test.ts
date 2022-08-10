import {
  AddonRequest,
  CatalogRequest,
  createApp,
  createEngine,
  ItemRequest,
  SourceRequest,
} from "@mediahubmx/sdk";
import request from "supertest";
import { dummyAddon } from "../addon/dummyAddon";
import { TEST_ITEMS, TEST_SOURCES, TEST_SUBTITLES } from "../addon/testData";

const sdkVersion = require("@mediahubmx/sdk/package.json").version;

const defaults = {
  language: "en",
  region: "UK",
  clientVersion: require("@mediahubmx/sdk/package.json").version,
};

const itemDefaults: ItemRequest = {
  ...defaults,
  type: "movie",
  ids: {
    id: "elephant",
    "dummy-test": "elephant",
  },
  name: "Elephants Dream",
  nameTranslations: {},
  episode: {},
};

const engine = createEngine([dummyAddon], { testMode: true });
const app = request(createApp(engine, { singleMode: false }));

test("action addon", async () => {
  await app
    .post(`/${dummyAddon.getId()}/mediahubmx.json`)
    .send(<AddonRequest>{ ...defaults })
    .expect(200, { ...dummyAddon.getProps(), sdkVersion });
});

test("action catalog", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-catalog.json`)
    .send(<CatalogRequest>{
      ...defaults,
      id: "",
      adult: false,
      search: "",
      sort: "",
      filter: {},
      cursor: null,
    })
    .expect(200, {
      items: TEST_ITEMS.map((fn) => fn(false)),
      nextCursor: null,
    });
});

test("action item", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-item.json`)
    .send(<ItemRequest>itemDefaults)
    .expect(
      200,
      TEST_ITEMS.map((fn) => fn(true)).find(
        (i) => i.ids["dummy-test"] === "elephant"
      )
    );
});

test("action source", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-source.json`)
    .send(<SourceRequest>itemDefaults)
    .expect(200, TEST_SOURCES.elephant);
});

test("action subtitle", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-subtitle.json`)
    .send(<SourceRequest>itemDefaults)
    .expect(200, TEST_SUBTITLES.elephant);
});

test("action subtitle (cached response)", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-subtitle.json`)
    .send(<SourceRequest>itemDefaults)
    .expect(200, TEST_SUBTITLES.elephant);
});

test("action selftest", async () => {
  app
    .post(`/${dummyAddon.getId()}/mediahubmx-selftest.json`)
    .send()
    .expect(200, '"ok"');
});

test("action server selftest", async () => {
  app
    .post("/mediahubmx-selftest.json")
    .send()
    .expect(200, { "dummy-test": [200, "ok"] });
});

test("action server", async () => {
  app
    .post(`/mediahubmx.json`)
    .send()
    .expect(200, { type: "server", addons: ["dummy-test"] });
});
