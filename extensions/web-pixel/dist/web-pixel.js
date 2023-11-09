(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs
  var EXTENSION_POINT;
  var init_globals = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs"() {
      EXTENSION_POINT = "WebPixel::Render";
    }
  });

  // node_modules/@shopify/web-pixels-extension/build/esm/register.mjs
  var register;
  var init_register = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/register.mjs"() {
      init_globals();
      register = (extend) => shopify.extend(EXTENSION_POINT, extend);
    }
  });

  // node_modules/@shopify/web-pixels-extension/build/esm/index.mjs
  var init_esm = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/index.mjs"() {
      init_register();
    }
  });

  // node_modules/@shopify/web-pixels-extension/index.mjs
  var init_web_pixels_extension = __esm({
    "node_modules/@shopify/web-pixels-extension/index.mjs"() {
      init_esm();
    }
  });

  // extensions/web-pixel/src/index.js
  var require_src = __commonJS({
    "extensions/web-pixel/src/index.js"(exports) {
      "use strict";
      init_web_pixels_extension();
      var setTrailPixel = (event, ip_address) => {
        var _a, _b;
        const params = new URLSearchParams(event.context.document.location.search);
        const tp_id = params.get("tp_id");
        const tp_cid = params.get("tp_cid");
        const tp_pid = params.get("tp_pid");
        const tp_source = params.get("tp_source");
        let product_id = "";
        let product_id_type = "";
        if (tp_pid) {
          product_id = tp_pid;
          product_id_type = "source";
        } else {
          product_id = (_b = (_a = event.data) == null ? void 0 : _a.productVariant) == null ? void 0 : _b.product.id;
          product_id = product_id || "";
          product_id_type = product_id ? "website" : "";
        }
        let data = {
          client_id: event.clientId,
          tp_id,
          tp_cid,
          tp_source,
          product_id,
          product_id_type,
          tp_datetime: event.timestamp,
          tp_session: event.timestamp,
          useragent: event.context.navigator.userAgent,
          path: event.context.document.location.pathname,
          ip_address,
          version: "v1",
          event_name: event.name
        };
        const requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          keepalive: true,
          headers: {
            "Content-Type": "application/json"
          }
        };
        fetch("https://2e727bdf16c0f6481cfdd8246892b47d.serveo.net/set-trail-pixel", requestOptions).then((response) => response.json()).then((jsonResponse) => console.log(jsonResponse)).catch((error) => console.error("Error:", error));
      };
      var getIPAndSend = (event) => {
        fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
          setTrailPixel(event, data.ip);
        }).catch((error) => console.error("Error:", error));
      };
      register((_0) => __async(exports, [_0], function* ({ analytics, browser, settings }) {
        analytics.subscribe("all_events", (event) => {
          if (event.name === "page_viewed") {
            getIPAndSend(event);
          } else if (event.name === "product_viewed") {
            getIPAndSend(event);
          }
        });
      }));
    }
  });

  // <stdin>
  var import_src = __toESM(require_src());
})();
