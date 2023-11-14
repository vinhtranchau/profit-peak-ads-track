import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    const { cors } = await authenticate.public(request);
    const { admin } = await authenticate.public.appProxy(request);

    let { client_id, tp_id, tp_cid, tp_source, product_id, product_id_type, tp_datetime, tp_session, useragent, path, ip_address, version, event_name } = request.body;

    tp_id = tp_id || '';
    tp_cid = tp_cid || '';
    tp_source = tp_source || '';
    product_id = product_id || '';
    product_id_type = product_id_type || '';

    return cors(json( request.body ));
};