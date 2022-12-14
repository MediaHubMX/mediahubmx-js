import { BasicCache, registerCacheEngineCreator } from "@mediahubmx/cache";
import { Db, MongoClient, MongoClientOptions } from "mongodb";

const COLLECTION_NAME = "mediahubmx_cache";
const PAYLOAD_FIELD = "c";
/** Expiration date */
const DATE_FIELD = "d";

const defaultOptions: MongoClientOptions = {
  minPoolSize: 10,
};

export class MongodbCache extends BasicCache {
  private initPromise: Promise<void>;
  private db: Db;

  constructor(url: string, opts?: MongoClientOptions) {
    super();
    this.initPromise = (async () => {
      const c = new MongoClient(url, { ...defaultOptions, ...opts });
      // const c = await mongodb.connect(url, { ...defaultOptions, ...opts });
      this.db = c.db(url.split("/").pop());
      await this.initCollection();
    })();
  }

  private async initCollection() {
    await this.db
      .collection(COLLECTION_NAME)
      .createIndex({ [DATE_FIELD]: 1 }, { expireAfterSeconds: 0 });
  }

  public async exists(key: string) {
    await this.initPromise;
    return (
      (
        await this.db
          .collection(COLLECTION_NAME)
          .find({ _id: key.substring(1) }, { projection: {}, limit: 1 })
          .toArray()
      ).length > 0
    );
  }

  public async get(key: string) {
    await this.initPromise;
    const resp = await this.db
      .collection(COLLECTION_NAME)
      .findOne({ _id: key.substring(1) });
    if (!resp || (resp[DATE_FIELD] !== null && resp[DATE_FIELD] < new Date())) {
      return undefined;
    }
    return resp[PAYLOAD_FIELD];
  }

  public async set(key: string, value: any, ttl: number) {
    await this.initPromise;
    await this.db.collection(COLLECTION_NAME).updateOne(
      { _id: key.substring(1) },
      {
        $set: {
          [DATE_FIELD]: ttl === Infinity ? null : new Date(Date.now() + ttl),
          [PAYLOAD_FIELD]: value,
        },
      },
      { upsert: true }
    );
  }

  public async delete(key: string) {
    await this.initPromise;
    await this.db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: key.substring(1) });
  }

  public async deleteAll() {
    await this.initPromise;
    await this.db.collection(COLLECTION_NAME).drop();
    this.initPromise = this.initCollection();
  }
}

registerCacheEngineCreator(() =>
  process.env.MONGODB_URL ? new MongodbCache(process.env.MONGODB_URL) : null
);
