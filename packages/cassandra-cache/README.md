# MediaHubMX Cassandra caching engine

[Cassandra](https://cassandra.apache.org/) caching engine for MeduaURL addons.

You can find the caching documentation [here](https://github.com/MediaHubMX/mediahubmx-js/blob/main/docs/caching.md).

## Usage with your addon

```bash
# Build your addon
npm run build

# Install the caching engine
npm i @mediahubmx/cassandra-cache

# Setup environment
export LOAD_MEDIAHUBMX_CACHE_MODULE=@mediahubmx/cassandra-cache
export CASSANDRA_CONFIG=address-of-your-server.com

# Start the addon server
npm start
```

## Testing

```bash
# Start a local cassandra database server
docker run --rm -ti -p 9042:9042 cassandra

# Run the tests
CASSANDRA_CONFIG=localhost npm run test
```
