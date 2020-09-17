# Rate limiter

Rate limiter is a global express middleware that can be added to rate limit requests
coming over a period of time.

## Design

The rate limiter works by tracking requests made by the ip address of the requester. From this it determines whether the requester has exceeded the configured limit/ttl. The tracking of requests is stored in an in-memory map to to have fast look up times (`O(1)` look up), in order not to add much more additional time on to the request time.

The core rate limiting logic is determined based on whether the number of non expired tracked requests has exceed the limit specified in the config. The way in which the retryIn is determine is through inspected the oldest non expired request entry and determine how close its time is to the ttl.

The in-memory map is plugged into the rate limiter meaning it can be easier swapped out for other adapter variants such as redis.

This config files allows for the middleware to be configurable for different scenarios.

## Requirements

- `NodeJS v14.3 or higher`

## Installation

- `npm i`

## How to run

- `npm start`

An express server will spin up with an example endpoint `http://localhost:5000/test` and from there you can call the end point to see the rate limiter in effect.

The rate limiter (RateLimiterConfig) can be configured as the follow:

```
{
    limit: Number, // the limit on number of requests
    ttl: Number // the period of time the limit applies for
}
```

For example with:

```
{
   limit: 2,
   ttl: 3600000 // 1 hour
}
```

then test it from the command line:

```
❯ curl http://localhost:5000/test
Hello World!                                                                          ❯ curl http://localhost:5000/test
Hello World!                                                                          ❯ curl http://localhost:5000/test
Rate limit exceeded. Try again in 3598 seconds
```

## How to run tests

- `npm run test`
