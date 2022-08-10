import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const flatten = (s: any) => {
  if (Array.isArray(s)) return s.map(flatten);
  if (!s) return s;
  if (typeof s === "object") {
    const r = {};
    for (const k of Object.keys(s)) {
      let v = s[k];
      if (k === "$ref") v = v.replace(/^[a-z0-9]+\.yaml#/, "#");

      r[k] = flatten(v);
    }
    return r;
  }
  return s;
};

const load = () => {
  let data: any = {};
  const p = path.join(__dirname, "..", "schema");
  const dir = fs.opendirSync(p);
  for (;;) {
    const e = dir.readSync();
    if (e === null) break;
    if (!/\.yaml$/.test(e.name)) continue;
    if (e.name === "openapi.yaml") continue;
    const n: any = yaml.load(fs.readFileSync(path.join(p, e.name), "utf-8"));
    data = {
      ...data,
      ...n,
      definitions: {
        ...data.definitions,
        ...n.definitions,
      },
    };
  }
  dir.closeSync();
  return flatten(data);
};

export default load();
