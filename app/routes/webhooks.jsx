import { authenticate } from "../shopify.server";
import db from "../db.server";
import { getLastUpdatedAt } from "../models/CustomerVisit.server";

const GET_ORDERS = `
query getOrders($numOrders: Int!, $cursor: String, $query: String) {
  orders (first: $numOrders, after: $cursor, query: $query) {
    edges {
      node {
        id
        name
        note
        updatedAt
        customer {
          id
          firstName
          lastName
        }
        customerJourneySummary {
          customerOrderIndex
          daysToConversion
          momentsCount
          firstVisit {
            landingPage
            landingPageHtml
            occurredAt
            referralCode
            referralInfoHtml
            referrerUrl
            source
            sourceDescription
            sourceType
            utmParameters {
              campaign
              content
              medium
              source
              term
            }
          }
          lastVisit {
            landingPage
            landingPageHtml
            occurredAt
            referralCode
            referralInfoHtml
            referrerUrl
            source
            sourceDescription
            sourceType
            utmParameters {
              campaign
              content
              medium
              source
              term
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

const updateCustomerVisit = (graphql) => {

  // Get last update_date from CustomerVist table
  getLastUpdatedAt().then(async (value) => {
    console.log("lastUpdateDate:", value);
    getOrdersToSave(value, graphql).then((orders) => {

      // Convert the data into CustomerVisit model
      const customerVisits = convertToCustomerVisit(orders);

      customerVisits.map(async (visit, index) => {
        try {
          const visitJson = JSON.stringify(visit);
          console.log("Order ", index, ": ", visitJson);
          // // If customer visit info is not added yet, don't add the record
          // // First record is in db already, so skip it
          // if (visit.momentsCount && index > 0) {
          //   await db.customerVisit.create({ data: visit });
          // }
        } catch(excep) {
          console.log("Failed to store CustomerVisits in DB: ", excep);
          console.log("Faiiled Visit: ", visit);
        }
      });
    });
  });
};

const getOrdersToSave = async (lastUpdateDate, graphql) => {
  const ordersToSave = [];
  try {
    let query = null;
    // if (lastUpdateDate) {
    //   // If last update_date is not Null, get orders after the last update_date
    //   console.log("LastUpdateDate is ", lastUpdateDate, ", it needs to add the rest.");
    //   query = "updated_at:>'" + lastUpdateDate + "'";
    // } else {
    //   // If last update_date is Null, get all orders from Shopify
    // }
    
    // `first` or `last` argument is mandatary, set "first: 10" as default
    // Until `pageInfo.hasNextPage == false`, get orders and store data
    
    let hasNextPage = true;
    let cursor = null;

    while(hasNextPage) {
      const response = await graphql(
        GET_ORDERS,
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

      ordersToSave.push(...orders);
    }
  } catch (exception) {
    console.log("Failed to update customer visit information.", exception);
  }

  return ordersToSave;
}

const convertToCustomerVisit = (orders) => {
  return orders.map((order) => ({
    orderId                     : order.id,
      orderName                   : order.name,
      orderNote                   : order.note,
      orderUpdatedAt              : order.updatedAt,
      customerId                  : order.customer && order.customer.id,
      customerName                : order.customer && (order.customer.firstName + " " + order.customer.lastName),
      customerOrderIndex          : order.customerJourneySummary && order.customerJourneySummary.customerOrderIndex,
      daysToConversion            : order.customerJourneySummary && order.customerJourneySummary.daysToConversion,
      momentsCount                : order.customerJourneySummary && order.customerJourneySummary.momentsCount,
      firstVisitLandingPage       : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.landingPage,
      firstVisitOccuredAt         : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.occurredAt,
      firstVisitReferralCode      : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referralCode,
      firstVisitReferralInfoHtml  : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referralInfoHtml,
      firstVisitReferrerUrl       : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referrerUrl,
      firstVisitSource            : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.source,
      firstVisitSourceDescription : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.sourceDescription,
      firstVisitSourceType        : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.sourceType,
      firstVisitUtmCampaign       : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.campaign,
      firstVisitUtmContent        : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.content,
      firstVisitUtmMedium         : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.medium,
      firstVisitUtmSource         : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.source,
      firstVisitUtmTerm           : order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.term,
      lastVisitLandingPage        : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.landingPage,
      lastVisitOccuredAt          : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.occurredAt,
      lastVisitReferralCode       : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referralCode,
      lastVisitReferralInfoHtml   : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referralInfoHtml,
      lastVisitReferrerUrl        : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referrerUrl,
      lastVisitSource             : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.source,
      lastVisitSourceDescription  : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.sourceDescription,
      lastVisitSourceType         : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.sourceType,
      lastVisitUtmCampaign        : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.campaign,
      lastVisitUtmContent         : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.content,
      lastVisitUtmMedium          : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.medium,
      lastVisitUtmSource          : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.source,
      lastVisitUtmTerm            : order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.term
  }))
}

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
      updateCustomerVisit(admin.graphql);
      break;
    case "ORDER_TRANSACTIONS_CREATE":
      console.log("Order Transaction Created!");
      break;
    case "CARTS_CREATE":
      console.log("Cart Created!");
      break;
    case "CARTS_UPDATE":
      console.log("Cart Updated!");
      // For test
      updateCustomerVisit(admin.graphql);
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};