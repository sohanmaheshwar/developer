title = "Building Spin Components in JavaScript"
template = "spin_main"
date = "2023-02-23T00:22:56Z"

---
- [Installing Templates](#installing-templates)
- [Structure of a Python Component](#structure-of-a-python-component)
- [Building and Running the Template](#building-and-running-the-template)
- [HTTP Components](#http-components)
- [Sending Outbound HTTP Requests](#sending-outbound-http-requests)
- [Storing Data in Redis From Python Components](#storing-data-in-redis-from-python-components)
- [Using Python Libraries](#using-python-libraries)

With Python being a very popular language, Spin provides support for building components with it using the experimental SDK. The development of the Python SDK is continually being worked on to improve user experience and add features. 

> This guide assumes you are familiar with the Python programming language,
> but if you are just getting started, be sure to check [the Python reference](https://docs.python.org/3/reference/).

> All examples from this page can be found in [the Python SDK repository on GitHub](https://github.com/fermyon/spin-python-sdk/tree/main/examples).

In order to compile JavaScript programs to Spin components, you also need to install a Spin plugin `py2wasm` using the following command:

<!-- @selectiveCpy -->

```bash
$ spin plugin update
$ spin plugin install py2wasm
```

## Installing Templates

The Python template can be installed from [spin-python-sdk repository](https://github.com/fermyon/spin-python-sdk/tree/main/) using the following command:

<!-- @selectiveCpy -->

```bash
$ spin templates install --git https://github.com/fermyon/spin-python-sdk --update
```

which will install the `http-py` template:

<!-- @nocpy -->

```text
Copying remote template source
Installing template http-py...
Installed 1 template(s)

+---------------------------------------------+
| Name      Description                       |
+=============================================+
| http-py   HTTP request handler using Python |
+---------------------------------------------+
```

## Structure of a Python Component

A new Python component can be created using the following command:

<!-- @selectiveCpy -->

```bash
$ spin new http-py hello-world --accept-defaults
```

This creates a directory of the following structure:

<!-- @nocpy -->

```text
hello-world/
├── app.py
├── Pipfile
└── spin.toml
```

The source for the component is present in `app.py` which will then be compiled to a `.wasm` module using the `py2wasm` plugin.

## Building and Running the Template

First, the dependencies for the template need to be installed and then bundled into a single JavaScript file using the following commands:

<!-- @selectiveCpy -->

```bash
$ cd hello-world
$ spin build
```

Once a Spin compatible module is created, it can be run using:

<!-- @selectiveCpy -->

```bash
$ spin up
```

## HTTP Components

In Spin, HTTP components are triggered by the occurrence of an HTTP request, and
must return an HTTP response at the end of their execution. Components can be
built in any language that compiles to WASI, and Javascript/TypeScript has improved support
for writing Spin components with the Spin Python SDK.

> Make sure to read [the page describing the HTTP trigger](./http-trigger.md) for more
> details about building HTTP applications.

Building a Spin HTTP component using the Python SDK means writing a single function
that takes an HTTP request as a parameter, and returns an HTTP response — below
is a complete implementation for such a component in TypeScript:

<!-- @nocpy -->

```python
from spin_http import Response

def handle_request(request):

    return Response(200,
        [("content-type", "text/plain")],
        bytes(f"Hello from the Python SDK", "utf-8"))
```

The important things to note in the implementation above:

- the `handle_request` function is the entry point for the Spin component.
- the component returns `HttpResponse`.

## Sending Outbound HTTP Requests

If allowed, Spin components can send outbound HTTP requests.
Let's see an example of a component that makes a request to
[an API that returns random dog facts](https://some-random-api.ml/facts/dog) and
inserts a custom header into the response before returning:

<!-- @nocpy -->

```python
from spin_http import Request, Response, http_send
from spin_config import config_get

def handle_request(request):

    response = http_send(Request("GET", "https://some-random-api.ml/facts/dog", [], None))
    print(f"Got dog fact: {str(response.body, 'utf-8')}")

    config = config_get("message")

    return Response(200,
                    [("content-type", "text/plain")],
                    bytes(f"Here is a dog fact: {str(response.body, 'utf-8')}", "utf-8"))
```

Before we can execute this component, we need to add the `some-random-api.ml`
domain to the application manifest `allowed_http_hosts` list containing the list of
domains the component is allowed to make HTTP requests to:

<!-- @nocpy -->

```toml
# spin.toml
spin_version = "1"
authors = ["Fermyon Engineering <engineering@fermyon.com>"]
name = "spin-http-py"
trigger = { type = "http", base = "/" }
version = "1.0.0"

[variables]
object = { default = "teapot" }

[[component]]
id = "hello"
source = "app.wasm"
allowed_http_hosts = ["https://some-random-api.ml"]
[component.trigger]
route = "/..."
[component.config]
message = "I'm a {{object}}"
[component.build]
command = "npm run build"
```

The component can be built using the `spin build` command. Running the application using `spin up --file spin.toml` will start the HTTP
listener locally (by default on `localhost:3000`), and our component can
now receive requests in route `/hello`:

<!-- @selectiveCpy -->

```text
$ curl -i localhost:3000/hello
HTTP/1.1 200 OK
date: Fri, 18 Mar 2022 03:54:36 GMT
content-type: application/json; charset=utf-8
content-length: 185
server: spin/0.1.0

Here's a dog fact: {"fact":"It's a myth that dogs only see in black and white. In fact, it's believed that dogs see primarily in blue, greenish-yellow, yellow and various shades of gray."}
```

> Without the `allowed_http_hosts` field populated properly in `spin.toml`,
> the component would not be allowed to send HTTP requests, and sending the
> request would result in a "Destination not allowed" error.

> You can set `allowed_http_hosts = ["insecure:allow-all"]` if you want to allow
> the component to make requests to any HTTP host. This is **NOT** recommended
> for any production or publicly-accessible application.

We just built a WebAssembly component that sends an HTTP request to another
service, manipulates that result, then responds to the original request.
This can be the basis for building components that communicate with external
databases or storage accounts, or even more specialized components like HTTP
proxies or URL shorteners.

---

## Storing Data in Redis From Python Components

> You can find a complete example for using outbound Redis from an HTTP component
> in the [spin-python-sdk repository on GitHub](https://github.com/fermyon/spin-python-sdk/blob/main/examples/typescript/outbound_redis/src/app.py).

Using the Spin's Python SDK, you can use the Redis key/value store and to publish messages to Redis channels.

Let's see how we can use the Python SDK to connect to Redis:

<!-- @nocpy -->

```python
from spin_redis import redis_del, redis_get, redis_incr, redis_set, redis_sadd, redis_srem, redis_smembers

redis_address = "redis://localhost:6379/"

def handle_request(request):
    # using redis get/set 
    redis_set(redis_address, "foo", b"bar")
    value = redis_get(redis_address, "foo")
    assert value == b"bar", f"expected \"bar\", got \"{str(value, 'utf-8')}\""\

    redis_del(redis_address, ["testIncr"])
    redis_incr(redis_address, "testIncr")
    print(redis_get(redis_address, "testIncr"))

    redis_sadd(redis_address, "testSets", ["hello", "world"])
    content = redis_smembers(redis_address, "testSets")
    redis_srem(redis_address, "testSets", ["hello"])


    return Response(200,
                    [("content-type", "text/plain")],
                    bytes(f"Hello from Python!"))
```

This HTTP component demonstrates fetching a value from Redis by key, setting a key with a value, and publishing a message to a Redis channel. The component is triggered by an HTTP request served on the route configured in the `spin.toml`:

> When using Redis databases hosted on the internet (i.e) not on localhost, the `redisAddress` must be of the format "redis://\<USERNAME\>:\<PASSWORD\>@\<REDIS_URL\>" (e.g) `redis://myUsername:myPassword@redis-database.com`

## Using Python Libraries

> Not all the Python packages are guaranteed to work with the SDK. Any libraries that include native code do not work currently. This unfortunately includes popular libraries like `numpy`, `pandas`, etc. Supporting these libraries is challenging because they rely on dynamically linking native code into the CPython interpreter, which isn't supported in core Wasm or WASI. There are ways to address this, as shown by projects like [Pyodide](https://pyodide.org), so we're confident we'll be able to do the same for Spin, but that work has not yet been done.


External libraries are to be installed using the pipenv tool. 