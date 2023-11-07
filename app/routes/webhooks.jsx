import { authenticate } from "../shopify.server";
import db from "../db.server";
import { getLastUpdatedAt } from "../models/TrailPixel.server";

const GET_TRACKS = `
query getOrders($numOrders: Int!, $cursor: String, $query: String) {
  orders (first: $numOrders, after: $cursor, query: $query) {
    edges {
      node {
        name
        updatedAt
        clientIp
        registeredSourceUrl
        customerJourneySummary {
          daysToConversion
          momentsCount
          firstVisit {
            landingPage
            occurredAt
            source
            utmParameters {
              campaign
              content
              medium
              source
            }
          }
          lastVisit {
            landingPage
            occurredAt
            source
            utmParameters {
              campaign
              content
              medium
              source
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

const updateTrailPixels = (graphql) => {

  // Get last update_date from CustomerVist table
  getLastUpdatedAt().then(async (value) => {
    console.log("lastUpdateDate:", value);
    getTracksToSave(value, graphql).then((tracks) => {

      tracks.map(async (track, index) => {
        try {
          // If customer visit info is not added yet(moments_count = 0), don't add the record
          // First record is in db already, so skip it
          if (track.moments_count && index > 0) {
            await db.trailPixel.create({ data: track });
          }
        } catch(excep) {
          console.log("Failed to store TrailPixels in DB: ", excep);
          console.log("Faiiled Track in Saving: ", track);
        }
      });
    });
  });
};

const getTracksToSave = async (lastUpdateDate, graphql) => {
  const tracks = [];
  try {
    let query = null;
    if (lastUpdateDate) {
      // If last update_date is not Null, get orders after the last update_date
      query = "updated_at:>'" + lastUpdateDate + "'";
    } else {
      // If last update_date is Null, get all orders from Shopify
    }
    
    // `first` or `last` argument is mandatary, set "first: 10" as default
    // Until `pageInfo.hasNextPage == false`, get orders and store data
    
    let hasNextPage = true;
    let cursor = null;

    while(hasNextPage) {
      const response = await graphql(
        GET_TRACKS,
        {
          variables: {
            numOrders: 10,
            cursor,
            query
          }
        }
      );
      const responseJson = await response.json();

      const orders = responseJson?.data?.orders?.edges?.map(
        (edge) => edge.node
      ) || [[]];

      hasNextPage = responseJson?.data?.orders?.pageInfo?.hasNextPage;
      cursor = responseJson?.data?.orders?.pageInfo?.endCursor;

      tracks.push(...orders);
    }
  } catch (exception) {
    console.log("Failed to Get Orders.", exception);
  }

  // Return the tracks using TrailPixel model
  return convertToTrailPixels(tracks);
};

const convertToTrailPixels = (orders) => {
  return orders.map((order) => {
    return {
      order_name                  : order.name,
      order_updated_at            : order.updatedAt,
      days_to_conversion          : order.customerJourneySummary && order.customerJourneySummary.daysToConversion,
      moments_count               : order.customerJourneySummary && order.customerJourneySummary.momentsCount,
      trail_pixel                 : JSON.stringify(getTrailPixel(order))
    }
  });
};

const getTrailPixel = (order) => {
  const firstVisitLandingPage       = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.landingPage;
  const firstVisitOccuredAt         = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.occurredAt;
  const firstVisitSource            = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.source;
  const firstVisitUtmCampaign       = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.campaign;
  const firstVisitUtmContent        = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.content;
  const firstVisitUtmMedium         = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.medium;
  const firstVisitUtmSource         = order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.source;
      
  const lastVisitLandingPage        = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.landingPage;
  const lastVisitOccuredAt          = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.occurredAt;
  const lastVisitSource             = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.source;
  const lastVisitUtmCampaign        = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.campaign;
  const lastVisitUtmContent         = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.content;
  const lastVisitUtmMedium          = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.medium;
  const lastVisitUtmSource          = order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.source;

  return [{
    tp_datetime: firstVisitOccuredAt,
    tp_utm_campaign: firstVisitUtmCampaign,
    tp_utm_content: firstVisitUtmContent,
    tp_utm_medium: firstVisitUtmMedium,
    tp_utm_source: firstVisitUtmSource,
    path: firstVisitLandingPage,
    ip_address: order.clientIp,
    product_id_type: firstVisitSource,
    version: "v1"
  }, {
    tp_datetime: lastVisitOccuredAt,
    tp_utm_campaign: lastVisitUtmCampaign,
    tp_utm_content: lastVisitUtmContent,
    tp_utm_medium: lastVisitUtmMedium,
    tp_utm_source: lastVisitUtmSource,
    path: lastVisitLandingPage,
    ip_address: order.clientIp,
    product_id_type: lastVisitSource,
    version: "v1"
  }]
};

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "ORDERS_CREATE":
      console.log("Order Created!");
      // updateTrailPixels(admin.graphql);
      break;
    case "CARTS_CREATE":
      console.log("Cart Created!");
      break;
    case "CARTS_UPDATE":
      console.log("Cart Updated!");
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};