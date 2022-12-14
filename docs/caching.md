# Cache

Caching can have many benefits for server processes. At action handlers, you have access to a `CacheHandler` instance via the `ctx.cache` variable. Please see the function documentation for more infos about this.

By default, all cache keys get's prefixed with the addon ID. You can change this by changing the `prefix` option.

_When running in a real-world environment with more than one process and maybe more than one server, the "remote tasks" functions (`ctx.fetch` and `ctx.recaptcha`) need a cache to be enabled which is reachable from all processes._

Currently there are the following caching engines available:

## Engines

The `MemoryCache` and `DiskCache` are built in. To add other caching engines, the recommended way is to load them via the `LOAD_MEDIAHUBMX_CACHE_MODULE` enviroment variable.

Check our [example addon](https://github.com/MediaHubMX/mhub-example/blob/main/Dockerfile) to see the usage of this caching system.

### `MemoryCache`

In memory cache, this is the default.

### `DiskCache`

A cache which uses the file system for storage. This is the most easy to setup cache and can be very helpful during development.

To enable this, set the environment variable `DISK_CACHE` to a path.

```shell
export DISK_CACHE=/data/mediahubmx-cache
npm run develop
```

### `RedisCache`

This cache engine is using the [redis](https://www.npmjs.com/package/redis) package. To activate it, set the environment variable `REDIS_URL` to a redis connection URL.

```shell
npm install @mediahubmx/redis-cache
export LOAD_MEDIAHUBMX_CACHE_MODULE="@mediahubmx/redis-cache"
export REDIS_URL=redis://localhost
npm run develop
```

### `MongoCache`

This cache engine is using [mongodb](https://www.mongodb.com/) as it's backend. To activate it, set the environment variable `MONGO_URL` to a mongodb connection URL.

```shell
npm install @mediahubmx/mongodb-cache
export LOAD_MEDIAHUBMX_CACHE_MODULE="@mediahubmx/mongodb-cache"
export MONGODB_URL=mongodb://localhost/database
npm run develop
```

### `SqlCache`

This cache engine is using PostgreSQL or MySQL as it's backend. To activate it, set the environment variable `SQL_CACHE_URL` with connection string value.

```shell
npm install @mediahubmx/sql-cache
export LOAD_MEDIAHUBMX_CACHE_MODULE="@mediahubmx/sql-cache"
export SQL_CACHE_URL=postgresql://dbuser:secretpassword@database.server.com:3211/mydb
npm run develop
```

### `CassandraCache`

This cache engine is using Cassandra as it's backend. This database is very suitable for long term caching. To activate it, set the environment variable `CASSANDRA_OPTIONS` with a komma separated list of Cassandra hosts, or a JSON encoded connection string.

```shell
npm install @mediahubmx/cassandra-cache
export LOAD_MEDIAHUBMX_CACHE_MODULE="@mediahubmx/cassandra-cache"
export SQL_CACHE_URL=cassandra-host-1,cassandra-host-2,cassandra-host-3
npm run develop
```
