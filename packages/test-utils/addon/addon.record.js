module.exports = [];

var currentId = 1;
function addRecord(record) {
  record.id = currentId++;
  if (record.action === "addon" && record.statusCode === 200) {
    record.output.sdkVersion = require("@mediahubmx/sdk/package.json").version;
  }
  module.exports.push(record);
}

// Record ID 1
addRecord({
  addon: "dummy-test",
  action: "addon",
  input: {
    language: "de",
    region: "CH",
  },
  output: {
    actions: ["catalog", "item", "source", "subtitle", "resolve"],
    id: "dummy-test",
    name: "Typescript Test Addon",
    version: "1.0.0",
    catalogs: [
      {
        kind: "vod",
        features: {
          search: {
            enabled: true,
          },
          sort: [
            {
              id: "name",
              name: "Name",
            },
            {
              id: "year",
              name: "Year",
            },
          ],
        },
      },
    ],
    pages: [
      {
        dashboards: [
          { type: "directory" },
          {
            type: "directory",
            id: "by-year",
            name: "By year",
            args: {
              sort: "year",
            },
          },
        ],
      },
    ],
    urlPatterns: [
      "https:\\/\\/thepaciellogroup.github.io\\/AT-browser-tests\\/video\\/ElephantsDream.webm",
    ],
    sdkVersion: "0.33.0",
  },
  statusCode: 200,
});

// Record ID 6
addRecord({
  addon: "dummy-test",
  action: "catalog",
  input: {
    language: "de",
    region: "CH",
    rootId: "",
    id: "",
    adult: false,
    search: "",
    sort: "",
    filter: {},
    cursor: null,
    page: 1,
  },
  output: {
    items: [
      {
        type: "movie",
        ids: {
          "dummy-test": "id1234",
        },
        name: "Test Item 1",
        description: "This item does not have any sources.",
        year: 2011,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "id1235",
        },
        name: "Big Buck Bunny",
        year: 2013,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "elephant",
        },
        name: "Elephants Dream",
        description: "Dream of elephants?",
        year: 2012,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "4ktest",
        },
        name: "4k Test",
        description: "Test video with 4k resolution",
        year: 2012,
      },
    ],
    nextCursor: null,
  },
  statusCode: 200,
});

// Record ID 7
addRecord({
  addon: "dummy-test",
  action: "catalog",
  input: {
    language: "de",
    region: "CH",
    rootId: "",
    id: "by-year",
    sort: "year",
    adult: false,
    search: "",
    filter: {},
    cursor: null,
    page: 1,
  },
  output: {
    items: [
      {
        type: "movie",
        ids: {
          "dummy-test": "id1234",
        },
        name: "Test Item 1",
        description: "This item does not have any sources.",
        year: 2011,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "elephant",
        },
        name: "Elephants Dream",
        description: "Dream of elephants?",
        year: 2012,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "4ktest",
        },
        name: "4k Test",
        description: "Test video with 4k resolution",
        year: 2012,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "id1235",
        },
        name: "Big Buck Bunny",
        year: 2013,
      },
    ],
    nextCursor: null,
  },
  statusCode: 200,
});

// Record ID 8
addRecord({
  addon: "dummy-test",
  action: "item",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1234",
      id: "id1234",
    },
    name: "Test Item 1",
    year: 2011,
  },
  output: {
    type: "movie",
    ids: {
      "dummy-test": "id1234",
    },
    name: "Test Item 1",
    description: "This item does not have any sources.",
    year: 2011,
  },
  statusCode: 200,
});

// Record ID 9
addRecord({
  addon: "dummy-test",
  action: "source",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1234",
      id: "id1234",
    },
    name: "Test Item 1",
    year: 2011,
  },
  output: [],
  statusCode: 200,
});

// Record ID 10
addRecord({
  addon: "dummy-test",
  action: "item",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1235",
      id: "id1235",
    },
    name: "Big Buck Bunny",
    year: 2013,
  },
  output: {
    type: "movie",
    ids: {
      "dummy-test": "id1235",
    },
    name: "Big Buck Bunny",
    year: 2013,
    similarItems: [
      {
        type: "directory",
        id: "test",
        name: "Big Buck Bunny static similar items",
        items: [
          {
            type: "movie",
            ids: {
              "dummy-test": "id1234",
            },
            name: "Test Item 1",
            description: "This item does not have any sources.",
            year: 2011,
          },
          {
            type: "movie",
            ids: {
              "dummy-test": "elephant",
            },
            name: "Elephants Dream",
            description: "Dream of elephants?",
            year: 2012,
          },
        ],
      },
    ],
  },
  statusCode: 200,
});

// Record ID 11
addRecord({
  addon: "dummy-test",
  action: "source",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1235",
      id: "id1235",
    },
    name: "Big Buck Bunny",
    year: 2013,
  },
  output: [
    {
      type: "url",
      id: "",
      name: "Source 1",
      url: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4",
    },
  ],
  statusCode: 200,
});

// Record ID 12
addRecord({
  addon: "dummy-test",
  action: "subtitle",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1235",
      id: "id1235",
    },
    name: "Big Buck Bunny",
    year: 2013,
  },
  output: [],
  statusCode: 200,
});

// Record ID 13
addRecord({
  addon: "dummy-test",
  action: "item",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1234",
      id: "id1234",
    },
    name: "Test Item 1",
    year: 2011,
  },
  output: {
    type: "movie",
    ids: {
      "dummy-test": "id1234",
    },
    name: "Test Item 1",
    description: "This item does not have any sources.",
    year: 2011,
  },
  statusCode: 200,
});

// Record ID 14
addRecord({
  addon: "dummy-test",
  action: "source",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "id1234",
      id: "id1234",
    },
    name: "Test Item 1",
    year: 2011,
  },
  output: [],
  statusCode: 200,
});

// Record ID 15
addRecord({
  addon: "dummy-test",
  action: "item",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "elephant",
      id: "elephant",
    },
    name: "Elephants Dream",
    year: 2012,
  },
  output: {
    type: "movie",
    ids: {
      "dummy-test": "elephant",
    },
    name: "Elephants Dream",
    description: "Dream of elephants?",
    year: 2012,
    similarItems: [
      {
        type: "directory",
        id: "test",
        name: "Elephants Dream static similar items",
        initialData: {
          items: [
            {
              type: "movie",
              ids: {
                "dummy-test": "id1234",
              },
              name: "Test Item 1",
              description: "This item does not have any sources.",
              year: 2011,
            },
            {
              type: "movie",
              ids: {
                "dummy-test": "id1235",
              },
              name: "Big Buck Bunny",
              year: 2013,
            },
          ],
          nextCursor: null,
        },
      },
    ],
  },
  statusCode: 200,
});

// Record ID 16
addRecord({
  addon: "dummy-test",
  action: "source",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "elephant",
      id: "elephant",
    },
    name: "Elephants Dream",
    year: 2012,
  },
  output: [
    {
      type: "url",
      name: "mp4",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.mp4",
    },
    {
      type: "url",
      name: "webm",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.webm",
    },
  ],
  statusCode: 200,
});

// Record ID 17
addRecord({
  addon: "dummy-test",
  action: "subtitle",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "elephant",
      id: "elephant",
    },
    name: "Elephants Dream",
    year: 2012,
  },
  output: [
    {
      id: "vtt",
      name: "VTT",
      language: "en",
      type: "vtt",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.vtt",
    },
    {
      id: "ttml",
      name: "TTML",
      language: "en",
      type: "ttml",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.ttml",
    },
  ],
  statusCode: 200,
});

// Record ID 18
addRecord({
  addon: "dummy-test",
  action: "resolve",
  input: {
    language: "de",
    region: "CH",
    url: "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.webm",
  },
  output: {
    url: "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.webm?chain=1",
    resolveAgain: true,
  },
  statusCode: 200,
});

// Record ID 19
addRecord({
  addon: "dummy-test",
  action: "subtitle",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "elephant",
      id: "elephant",
    },
    name: "Elephants Dream",
    year: 2012,
  },
  output: [
    {
      id: "vtt",
      name: "VTT",
      language: "en",
      type: "vtt",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.vtt",
    },
    {
      id: "ttml",
      name: "TTML",
      language: "en",
      type: "ttml",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.ttml",
    },
  ],
  statusCode: 200,
});

// Record ID 20
addRecord({
  addon: "dummy-test",
  action: "resolve",
  input: {
    language: "de",
    region: "CH",
    url: "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.webm?chain=1",
  },
  output:
    "https://thepaciellogroup.github.io/AT-browser-tests/video/ElephantsDream.webm?chain=1",
  statusCode: 200,
});

// Record ID 21
addRecord({
  addon: "dummy-test",
  action: "subtitle",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "elephant",
      id: "elephant",
    },
    name: "Elephants Dream",
    year: 2012,
  },
  output: [
    {
      id: "vtt",
      name: "VTT",
      language: "en",
      type: "vtt",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.vtt",
    },
    {
      id: "ttml",
      name: "TTML",
      language: "en",
      type: "ttml",
      url: "https://thepaciellogroup.github.io/AT-browser-tests/video/subtitles-en.ttml",
    },
  ],
  statusCode: 200,
});

// Record ID 22
addRecord({
  addon: "dummy-test",
  action: "item",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "4ktest",
      id: "4ktest",
    },
    name: "4k Test",
    year: 2012,
  },
  output: {
    type: "movie",
    ids: {
      "dummy-test": "4ktest",
    },
    name: "4k Test",
    description: "Test video with 4k resolution",
    year: 2012,
    similarItems: [
      {
        type: "directory",
        id: "test",
        name: "Dynamic similar items",
        args: {},
      },
      {
        type: "directory",
        id: "test-2",
        name: "Static similar items",
        initialData: {
          items: [
            {
              type: "movie",
              ids: {
                "dummy-test": "id1234",
              },
              name: "Test Item 1",
              description: "This item does not have any sources.",
              year: 2011,
            },
            {
              type: "movie",
              ids: {
                "dummy-test": "id1235",
              },
              name: "Big Buck Bunny",
              year: 2013,
            },
          ],
          nextCursor: null,
        },
      },
    ],
  },
  statusCode: 200,
});

// Record ID 23
addRecord({
  addon: "dummy-test",
  action: "catalog",
  input: {
    language: "de",
    region: "CH",
    rootId: "",
    id: "test",
    adult: false,
    search: "",
    sort: "",
    filter: {},
    cursor: null,
    page: 1,
  },
  output: {
    items: [
      {
        type: "movie",
        ids: {
          "dummy-test": "id1234",
        },
        name: "Test Item 1",
        description: "This item does not have any sources.",
        year: 2011,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "id1235",
        },
        name: "Big Buck Bunny",
        year: 2013,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "elephant",
        },
        name: "Elephants Dream",
        description: "Dream of elephants?",
        year: 2012,
      },
      {
        type: "movie",
        ids: {
          "dummy-test": "4ktest",
        },
        name: "4k Test",
        description: "Test video with 4k resolution",
        year: 2012,
      },
    ],
    nextCursor: null,
  },
  statusCode: 200,
});

// Record ID 24
addRecord({
  addon: "dummy-test",
  action: "source",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "4ktest",
      id: "4ktest",
    },
    name: "4k Test",
    year: 2012,
  },
  output: [
    {
      type: "url",
      name: "hls",
      url: "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8",
    },
  ],
  statusCode: 200,
});

// Record ID 25
addRecord({
  addon: "dummy-test",
  action: "subtitle",
  input: {
    language: "de",
    region: "CH",
    type: "movie",
    ids: {
      "dummy-test": "4ktest",
      id: "4ktest",
    },
    name: "4k Test",
    year: 2012,
  },
  output: [],
  statusCode: 200,
});
