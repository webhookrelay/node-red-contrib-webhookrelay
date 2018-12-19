<p align="center">
    <a href="https://webhookrelay.com" target="_blank"><img width="100"src="https://webhookrelay.com/images/sat_logo.png"></a>
</p>

## Problem

Node-RED is great at receiving and processing various kinds of events but is not considered safe to be exposed to the internet (more info [here](https://github.com/node-red/cookbook.nodered.org/wiki/How-to-safely-expose-Node-RED-to-the-Internet)). Also, to expose Node-RED to the internet, you will need to either deploy it on a public cloud instance or configure your router NAT/firewall.  

<!-- Ubiquitous HTTP protocol allows any application to talk to any other application over the network. However, sometimes applications are behind firewalls, routers that don't do NAT, or just don't have an HTTP server at all. In this case applications would have to do HTTP polling that is slower and more resource intensive task. -->

## Solution

`node-red-contrib-webhookrelay` package provides an easy way to receive webhooks without exposing whole Node-RED instance to the internet. 

## How it works

Webhook Relay acts as a gateway to accept all webhooks and then route them to connected clients based on routing configuration. Connected clients can either be lightweight executables, Docker containers or WebSocket clients (this library is based on [our ws client](https://www.npmjs.com/package/webhookrelay-ws-client)):

<p align="center">
    <a href="https://webhookrelay.com" target="_blank"><img width="350" src="https://webhookrelay.com/images/whr-high-level.jpg"></a>
</p>

## Usage

1. Create a bucket `nodered` (or any other name) on the [buckets page](https://my.webhookrelay.com/buckets)
2. Get your authentication [token key and secret](https://my.webhookrelay.com/tokens)
3. Install our node:

```bash
npm install node-red-contrib-webhookrelay
```

4. Open node your node to add bucket name, authentication key and secret.
5. Connect any other node to your output.

Example JSON input to the `https://my.webhookrelay.com/v1/webhooks/544a6fe8-83fe-4361-a264-0fd486e1665d` endpoint:

```json
{
	"msg": "hello Node-RED!"
}
```

Example JSON object output from the node:

```json
{
	"topic": "nodered",
	"payload": {
		"type": "webhook",
		"meta": {
			"bucked_id": "12302faf-43bd-43c4-ab1d-89a8b0505693",
			"bucket_name": "nodered",
			"input_id": "544a6fe8-83fe-4361-a264-0fd486e1665d",
			"input_name": "Default public endpoint",
			"output_name": "",
			"output_destination": ""
		},
		"headers": {
			"Content-Type": ["application/json"],
			"Accept": ["*/*"],
			"Content-Length": ["29"],
			"User-Agent": ["insomnia/6.3.1"],
			"Cookie": ["__cfduid=dc244a014f0b1e2965544ddb483c3fe1b1525866866"]
		},
		"query": "",
		"body": "{\n\t\"msg\": \"hello Node-RED!\"\n}",
		"method": "PUT"
	},
	"_msgid": "43de3dbf.04f4c4"
}
```

## Alternative methods

You can also use Webhook Relay CLI. One way forwarding webhooks 

```bash
relay forward --bucket nodered http://127.0.0.1:1880/your/http/endpoint
```

Or exposing whole Node-RED to the internet:

```bash
relay connect http://127.0.0.1:1880
```

## Pricing

Webhook Relay has a free tier that can be enough for a lot of integration (CI/CD) but consider subscribing to a paid plan to support the project. Pricing can be found here: https://webhookrelay.com/pricing/. 