import { SetResultError } from "../errors";
import { CacheHandler } from "../handler";
import { CacheEngine } from "../types";

export const testCache = (
  name: string,
  createEngine: () => CacheEngine | Promise<CacheEngine>,
  /**
   * On slow computers the default waiting times may cause timeouts
   */
  multiplicator = 2
): void => {
  const options = {
    ttl: 1000 * multiplicator,
    errorTtl: 500 * multiplicator,
    prefix: "foobar",
  };

  const refreshInterval = 200 * multiplicator;
  const functionWait = 150 * multiplicator;

  const sleep = async (t: number) =>
    await new Promise((resolve) => setTimeout(resolve, t));

  const fnFailed = async () => {
    await sleep(functionWait);
    throw new Error("failed");
  };
  const fn1 = async () => {
    await sleep(functionWait);
    return "1";
  };
  const fn2 = async () => {
    await sleep(functionWait);
    return "2";
  };

  describe(`CacheHandler with ${name} engine`, () => {
    let cache: CacheHandler;

    beforeEach(async () => {
      cache = new CacheHandler(await createEngine(), options);
      await cache.engine.deleteAll();
    });

    afterEach(async () => {
      await cache.engine.deleteAll();
    });

    test("get, set, delete", async () => {
      await expect(cache.get("hello")).resolves.toBeUndefined();
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await expect(cache.set("hello", "2")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("2");
      await expect(cache.delete("hello")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("set disabled", async () => {
      cache.setOptions({ ttl: null });
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("setError disabled", async () => {
      cache.setOptions({ errorTtl: null });
      await expect(cache.setError("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("set forever", async () => {
      cache.setOptions({ ttl: Infinity });
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
    });

    test("setError forever", async () => {
      cache.setOptions({ errorTtl: Infinity });
      await expect(cache.setError("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
    });

    test("set and expire", async () => {
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await sleep(options.ttl * 1.2);
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("setError and expire", async () => {
      await expect(cache.setError("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await sleep(options.errorTtl * 1.2);
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("get, set, delete with compression", async () => {
      const value1 = "-1-".repeat(100);
      const value2 = "-2-".repeat(100);
      await expect(cache.get("hello-compress")).resolves.toBeUndefined();
      await expect(
        cache.set("hello-compress", value1)
      ).resolves.toBeUndefined();
      await expect(cache.get("hello-compress")).resolves.toBe(value1);
      await expect(
        cache.set("hello-compress", value2)
      ).resolves.toBeUndefined();
      await expect(cache.get("hello-compress")).resolves.toBe(value2);
      await expect(cache.delete("hello-compress")).resolves.toBeUndefined();
      await expect(cache.get("hello-compress")).resolves.toBeUndefined();
    });

    test("refresh interval with stored value", async () => {
      cache.setOptions({ refreshInterval });
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await sleep(refreshInterval * 1.2);
      await expect(cache.get("hello")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await expect(cache.set("hello", "2")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("2");
    });

    test("refresh interval with stored error", async () => {
      cache.setOptions({ refreshInterval, storeRefreshErrors: true });
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await sleep(refreshInterval * 1.2);
      await expect(cache.get("hello")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await expect(cache.setError("hello", "error")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("error");
    });

    test("refresh interval with ignored error", async () => {
      cache.setOptions({ refreshInterval, storeRefreshErrors: false });
      await expect(cache.set("hello", "1")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await sleep(refreshInterval * 1.2);
      await expect(cache.get("hello")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
      await expect(cache.setError("hello", "error")).resolves.toBeUndefined();
      await expect(cache.get("hello")).resolves.toBe("1");
    });

    test("waitKey timeout", async () => {
      const t = Date.now();
      await expect(
        cache.waitKey("hello", functionWait, true, 10 * multiplicator)
      ).rejects.toThrowError("Wait timed out");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
    });

    test("waitKey success with delete", async () => {
      const t = Date.now();
      setTimeout(() => cache.set("hello", "1"), functionWait / 2);
      await expect(
        cache.waitKey("hello", functionWait, true, 10 * multiplicator)
      ).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait / 2);
      expect(Date.now() - t).toBeLessThan(functionWait);
      await expect(cache.get("hello")).resolves.toBeUndefined();
    });

    test("waitKey success without delete", async () => {
      const t = Date.now();
      setTimeout(() => cache.set("hello", "1"), functionWait / 2);
      await expect(
        cache.waitKey("hello", functionWait, false, 10 * multiplicator)
      ).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait / 2);
      expect(Date.now() - t).toBeLessThan(functionWait);
      await expect(cache.get("hello")).resolves.toBe("1");
    });

    test("call success", async () => {
      const fn = async () => {
        await sleep(functionWait);
        return "1";
      };
      let t = Date.now();
      await expect(cache.call("hello", fn)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
      await expect(cache.get("hello")).resolves.toMatchObject({ result: "1" });

      t = Date.now();
      await expect(cache.call("hello", fn)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
    });

    test("call error", async () => {
      let t = Date.now();
      await expect(cache.call("hello", fnFailed)).rejects.toThrowError(
        "failed"
      );
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
      await expect(cache.get("hello")).resolves.toMatchObject({
        error: "failed",
      });

      t = Date.now();
      await expect(cache.call("hello", fnFailed)).rejects.toThrowError(
        "failed"
      );
      expect(Date.now() - t).toBeLessThan(functionWait);

      cache.setOptions({ errorTtl: null });
      t = Date.now();
      await expect(cache.call("hello", fnFailed)).rejects.toThrowError(
        "failed"
      );
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
    });

    test("call success locked", async () => {
      cache.setOptions({
        simultanLockTimeout: 200 * multiplicator,
        simultanLockTimeoutSleep: 10 * multiplicator,
      });
      const t1 = Date.now();
      const t2 = Date.now();
      expect(cache.call("hello", fn1))
        .resolves.toBe("1")
        .then(() => {
          expect(Date.now() - t1).toBeGreaterThanOrEqual(functionWait);
        });
      await sleep(10);
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t2).toBeGreaterThanOrEqual(functionWait);

      let t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);

      await sleep(options.ttl);
      t = Date.now();
      await expect(cache.call("hello", fn2))
        .resolves.toBe("2")
        .then(() => {
          expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
        });
    });

    test("call success locked timeout", async () => {
      cache.setOptions({
        simultanLockTimeout: functionWait / 2,
        simultanLockTimeoutSleep: 10 * multiplicator,
      });
      const t1 = Date.now();
      const t2 = Date.now();
      expect(cache.call("hello", fn1))
        .resolves.toBe("1")
        .then(() => {
          expect(Date.now() - t1).toBeGreaterThanOrEqual(functionWait);
        });
      await sleep(10);
      await expect(cache.call("hello", fn2))
        .resolves.toBe("2")
        .then(() => {
          expect(Date.now() - t2).toBeGreaterThanOrEqual(functionWait);
        });

      const t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("2");
      expect(Date.now() - t).toBeLessThan(functionWait);
    });

    test("call success locked with error and refresh error store", async () => {
      cache.setOptions({
        simultanLockTimeout: functionWait / 2,
        simultanLockTimeoutSleep: 10 * multiplicator,
        refreshInterval,
        storeRefreshErrors: true,
        fallbackToCachedValue: false,
      });
      let t = Date.now();
      await expect(cache.call("hello", fn1)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait - 5);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
      await sleep(refreshInterval);

      t = Date.now();
      await expect(cache.call("hello", fnFailed)).rejects.toThrowError(
        "failed"
      );
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);

      t = Date.now();
      await expect(cache.call("hello", fn2)).rejects.toThrowError("failed");
      expect(Date.now() - t).toBeLessThan(functionWait);
    });

    test("call success locked with error and refresh error store and fallback to cached value", async () => {
      cache.setOptions({
        simultanLockTimeout: functionWait / 2,
        simultanLockTimeoutSleep: 10 * multiplicator,
        refreshInterval,
        storeRefreshErrors: true,
        fallbackToCachedValue: true,
      });
      let t = Date.now();
      await expect(cache.call("hello", fn1)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
      await sleep(refreshInterval);

      t = Date.now();
      await expect(cache.call("hello", fnFailed)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
    });

    test("call success locked with error and refresh without store", async () => {
      cache.setOptions({
        simultanLockTimeout: functionWait / 2,
        simultanLockTimeoutSleep: 10 * multiplicator,
        refreshInterval,
        storeRefreshErrors: false,
      });
      let t = Date.now();
      await expect(cache.call("hello", fn1)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
      await sleep(refreshInterval - functionWait);

      t = Date.now();
      await expect(cache.call("hello", fnFailed)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);
    });

    test("call with success error", async () => {
      cache.setOptions({
        refreshInterval,
      });

      const fn1 = async () => {
        await sleep(functionWait);
        throw new SetResultError("1");
      };
      const fn2 = async () => {
        await sleep(functionWait);
        throw new SetResultError("2");
      };
      let t = Date.now();
      await expect(cache.call("hello", fn1)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
      await expect(cache.get("hello")).resolves.toMatchObject({ result: "1" });

      t = Date.now();
      await expect(cache.call("hello", fn1)).resolves.toBe("1");
      expect(Date.now() - t).toBeLessThan(functionWait);

      await sleep(refreshInterval * 1.2);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("1");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait - 5);

      await sleep(options.ttl);

      t = Date.now();
      await expect(cache.call("hello", fn2)).resolves.toBe("2");
      expect(Date.now() - t).toBeGreaterThanOrEqual(functionWait);
    });

    test("cleanup and delete all", async () => {
      await expect(cache.set("key1", 1)).resolves.toBeUndefined();
      await expect(cache.set("key2", 2, "1m")).resolves.toBeUndefined();
      await expect(cache.set("key3", 3, Infinity)).resolves.toBeUndefined();

      await expect(cache.engine.cleanup()).resolves.toBeUndefined();

      await expect(cache.get("key1")).resolves.toBe(1);
      await expect(cache.get("key2")).resolves.toBe(2);
      await expect(cache.get("key3")).resolves.toBe(3);

      await sleep(options.ttl * 1.2);
      await expect(cache.engine.cleanup()).resolves.toBeUndefined();

      await expect(cache.get("key1")).resolves.toBeUndefined();
      await expect(cache.get("key2")).resolves.toBe(2);
      await expect(cache.get("key3")).resolves.toBe(3);

      await expect(cache.engine.deleteAll()).resolves.toBeUndefined();

      await expect(cache.get("key1")).resolves.toBeUndefined();
      await expect(cache.get("key2")).resolves.toBeUndefined();
      await expect(cache.get("key3")).resolves.toBeUndefined();
    });
  });
};
