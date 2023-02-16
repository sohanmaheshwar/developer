title = "Key-Value Store in Spin"
template = "spin_main"
date = "2022-03-14T00:22:56Z"
enable_shortcodes = true
[extra]
url = "https://github.com/fermyon/spin/blob/main/docs/content/key-value.md"

---

> Key-Value stores are not currently supported in the cloud. Stay tuned for updates on when you can run KV enabled applications on Fermyon Cloud.

From Spin version `0.9.0`, it offers an inbuilt KV store backed by sqlite to allow applications to persist data. The Javascript/TypeScript SDK, Rust and Go SDKs support using the KV store.

## Enabling KV Store Access for a Component

By default, each component in an application does not have a access to the KV store. To allow access to the KV store, the parameter `key_value_stores` must be set in the component section of the `spin.toml`.

```toml
[[component]]
id = "KV"
source = "target/wasm32-wasi/release/spin_key_value.wasm"
key_value_stores = ["default"]
```

Currently, creating and allowing access to only the "default" store is allowed. In the future, creation of more KV stores will be possible with runtime configuration.

The "default" store is shared across components which have access to it. 

## Using the KV Store

The following examples shows the usage of the KV store using the different SDKs.

{{ tabs "SDK" }}

{{ startTab "JS/TS"}}


```js
import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"

const encoder = new TextEncoder()

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {

    // Open the store
    let store = spinSdk.kv.openDefault()

    // Set a value in the store
    store.set("test-key", "Hello from KV")

    // Check if a key exists in the store
    let exists = store.exists("test-key")

    // List all the keys in the store
    let keyList = store.getKeys()

    // Get the value from the store
    let value = store.get("test-key")

    // Delete a Key in the store
    store.delete("test-key")

    let body = `The list of keys in the store are [${exists}]\nThe key test-key exists: ${exists}\n The value of test-key is "${value}"`

    return {
        status: 200,
        headers: {"content-type": "text/html"},
        body: body
    }
}
```

{{ blockEnd }}

{{ startTab "Rust"}}


```rust
use anyhow::Result;
use spin_sdk::{
    http::{Request, Response},
    http_component,
    key_value::{Store},
};
use std::str;

#[http_component]
fn handle_request(_req: Request) -> Result<Response> {
    // Open the default key-value store
    let store = Store::open_default()?;

    // Set a value in the store
    store.set("test-key", "Hello from KV")?;

    // Check if a key exists in the store
    let exists = store.exists("test-key")?;

    // List all the keys
    let key_list = store.get_keys()?;

    // Get a value from the store
    let value = store.get("test-key")?;

    // Delete a value form the store
    store.delete("test-key")?;

    let body = format!("The list of keys in the store are {:?}\nThe key test-key exists: {}\nThe value of test-key is \"{}\"", key_list, exists,str::from_utf8(&value)?);

    Ok(http::Response::builder().status(200).body(Some(body.into()))?)
}
```

{{ blockEnd }}

{{ startTab "Go"}}

{{ blockEnd }}

{{ blockEnd }}

## Running the Application

The application can be built and run using the following commands:

<!-- @selectiveCpy -->

```bash
$ spin build
$ spin up
Serving http://127.0.0.1:3000
Available Routes:
  test: http://127.0.0.1:3000 (wildcard)
```

We can test the application by ,aking a request using the following command:

<!-- @selectiveCpy -->

```bash
$ curl localhost:3000
The list of keys in the store are ["test-key"]
The key test-key exists: true
The value of test-key is "Hello world from KV"
```