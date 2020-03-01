/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// If you use this as a template, update the copyright with your own name.

// Sample Node-RED node file


module.exports = function (RED) {
    "use strict";
    // require any external libraries we may need....
    //var foo = require("foo-library");
    var ws = require(`webhookrelay-ws-client`);

    // The main node definition - most things happen in here
    function WebhookRelayNode(n) {
        // Create a RED node
        RED.nodes.createNode(this, n);
        this.title = n.title

        this.status({ fill: "red", shape: "ring", text: "disconnected" });

        // Store local copies of the node configuration (as defined in the .html)
        if (n.buckets !== "") {
            this.bucketsFilter = n.buckets.split(",");
            for (var i = 0; i < this.bucketsFilter.length; i++) {
                this.bucketsFilter[i] = this.bucketsFilter[i].trim()
            }
        } else {
            this.bucketsFilter = []
        }

        var credentials = this.credentials;
        if ((credentials) && (credentials.hasOwnProperty("key"))) { this.key = credentials.key; }
        else { this.error("No Webhook Relay token key set"); }
        if ((credentials) && (credentials.hasOwnProperty("secret"))) { this.secret = credentials.secret; }
        else { this.error("No Webhook Relay token secret set"); }


        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        var handler = function (payload) {
            // checking for status messages
            var parsed = JSON.parse(payload);
            if (parsed.type === 'status') {
                switch (parsed.status) {
                    case 'subscribed':
                        node.status({ fill: "green", shape: "dot", text: "connected" });
                        break;
                    case 'unauthorized':                        
                        node.status({ fill: "red", shape: "ring", text: "unauthorized" });
                        break;
                    default:
                        break;
                }
                // don't pass status messages to 
                // Node-RED
                node.log(`webhook relay status event received: '${parsed.status}', message: '${parsed.message}'`)
                return;
            }

            var msg = {
                topic: parsed.meta.bucket_name,
                payload: parsed
            }
            node.send(msg);
        }

        if (this.key && this.secret) {
            var client = new ws.WebhookRelayClient(node.key, node.secret, node.bucketsFilter, handler);
            client.connect();
            node.whrClient = client;
        }

        this.on('input', function (msg) {
            node.log(`responding to webhook event: '${msg.meta.id}', status: '${msg.status}'`)
            var client = new ws.WebhookRelayClient(node.key, node.secret);
            client.respond(msg)    
        });

        this.on("close", function () {
            // TODO: disconnect ws-client
            if (node.whrClient) {
                node.whrClient.disconnect();
            }
        });
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("webhookrelay", WebhookRelayNode, {
        credentials: {
            key: { type: "password" },
            secret: { type: "password" }
        }
    });
}
