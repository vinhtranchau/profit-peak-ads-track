import { register } from "@shopify/web-pixels-extension";

const setPixel = (event, ip_address) => {
  const params = new URLSearchParams(event.context.document.location.search);
  const tp_id = params.get("tp_id") || "";
  const tp_cid = params.get("tp_cid") || "";
  const tp_pid = params.get("tp_pid") || "";
  const tp_source = params.get("tp_source") || "";

  let product_id = "";
  let product_id_type = "";

  // If tp_pid is available in search params, product_id = tp_pid & product_id_type = "source"
  if (tp_pid) {
    product_id = tp_pid;
    product_id_type = "source";
  } else {
    // If it is possille to get product_id from event.data, product_id_type = "website" 
    product_id = event.data?.productVariant?.product.id;
    product_id = product_id || "";
    product_id_type = product_id ? "website" : "";
  }

  const data = {
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
    version: 'v1',
    event_name: event.name
  };

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(data),
    keepalive: true,
    headers: {
      "Content-Type": "application/json"
    }
  }

  fetch('https://trailpixel.serveo.net/api/set-pixel', requestOptions)
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse))
    .catch(error => console.error('Error:', error));
};

const getIPAndSetPixel = (event) => {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      setPixel(event, data.ip);
    })
    .catch(error => console.error('Error:', error));
};

const setTrailPixel = (event) => {
  const data = {
    client_id: event.clientId,
    order_time: event.timestamp,
    order_id: event.data.checkout.order.id,
    total_price: event.data.checkout.totalPrice,
    trail_pixel_useragent: event.context.navigator.userAgent,
    event_name: event.name
  }

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(data),
    keepalive: true,
    headers: {
      "Content-Type": "application/json"
    }
  }

  fetch('https://trailpixelsrv.serveo.net/set-trail-pixel', requestOptions)
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse))
    .catch(error => console.error('Error:', error));
}

register(async ({analytics, browser, settings}) => {
  analytics.subscribe('page_viewed', (event) => {
    getIPAndSetPixel(event);
  });

  analytics.subscribe('product_viewed', (event) => {
    getIPAndSetPixel(event);
  });

  analytics.subscribe('checkout_completed', (event) => {
    setTrailPixel(event);
  });
});

