import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  LegacyCard, 
  IndexTable,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`
    query getOrders {
      orders (first: 30, query: "status:any") {
        edges {
          node {
            id
            name
            note
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
      }
    }
  `);
  const responseJson = await response.json();

  const orders = responseJson?.data?.orders?.edges?.map(
    (edge) => edge.node
  ) || [[]];

  return json({
    orders: orders,
  });
};

export default function Index() {
  const nav = useNavigation();
  const data = useLoaderData();

  const isLoading = ["loading"].includes(nav.state);
  const itemCounts = 11;

  const resourceName = {
    singular: 'visit',
    plural: 'visits',
  };

  useEffect(() => {
    if (data) {
      shopify.toast.show("Orders received");
    }
  }, [data]);

  const refresh = () => {};

  const rowMarkup = (data?.orders != undefined) && data?.orders.map(
    (
      order,
      index,
    ) => (
      <IndexTable.Row
        id={order.id}
        key={order.id}
        position={index}
      >
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{index + 1}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.id}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.name}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.note}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customer && order.customer.id}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customer && (order.customer.firstName + " " + order.customer.lastName)}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.customerOrderIndex}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.daysToConversion}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.momentsCount}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.landingPage}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.occurredAt}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referralCode}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referralInfoHtml}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.referrerUrl}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.source}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.sourceDescription}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.sourceType}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.campaign}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.content}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.medium}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.source}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.firstVisit && order.customerJourneySummary.firstVisit.utmParameters && order.customerJourneySummary.firstVisit.utmParameters.term}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.landingPage}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.landingPageHtml}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.occurredAt}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referralCode}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referralInfoHtml}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.referrerUrl}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.source}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.sourceDescription}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.sourceType}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.campaign}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.content}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.medium}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.source}</div></IndexTable.Cell>
        <IndexTable.Cell><div style={{textAlign: 'center'}}>{order.customerJourneySummary && order.customerJourneySummary.lastVisit && order.customerJourneySummary.lastVisit.utmParameters && order.customerJourneySummary.lastVisit.utmParameters.term}</div></IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page fullWidth>
      <ui-title-bar title="Profit Peak Ads Track">
        <button variant="primary" onClick={refresh}>
          Refresh
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <LegacyCard>
            <IndexTable
              selectable={false}
              resourceName={resourceName}
              itemCount={data?.orders != undefined && data?.orders.length}
              headings={[
                {title: 'No', alignment: 'center'},
                {title: 'Order ID', alignment: 'center'},
                {title: 'Order Name', alignment: 'center'},
                {title: 'Order Note', alignment: 'center'},
                {title: 'Customer ID', alignment: 'center'},
                {title: 'Customer Name', alignment: 'center'},
                {title: 'Customer Order Index', alignment: 'center'},
                {title: 'Days to Conversion', alignment: 'center'},
                {title: 'Total Sessions', alignment: 'center'},
                {title: 'FirstVisit Landing Page', alignment: 'center'},
                {title: 'FirstVisit OccurredAt', alignment: 'center'},
                {title: 'FirstVisit Referral Code', alignment: 'center'},
                {title: 'FirstVisit Referral Info Html', alignment: 'center'},
                {title: 'FirstVisit Referral URL', alignment: 'center'},
                {title: 'FirstVisit Source', alignment: 'center'},
                {title: 'FirstVisit Source Description', alignment: 'center'},
                {title: 'FirstVisit Source Type', alignment: 'center'},
                {title: 'FirstVisit UTM Campaign', alignment: 'center'},
                {title: 'FirstVisit UTM Content', alignment: 'center'},
                {title: 'FirstVisit UTM Medium', alignment: 'center'},
                {title: 'FirstVisit UTM Source', alignment: 'center'},
                {title: 'FirstVisit UTM Term', alignment: 'center'},
                {title: 'LastVisit Landing Page', alignment: 'center'},
                {title: 'LastVisit Landing Page Html', alignment: 'center'},
                {title: 'LastVisit OccurredAt', alignment: 'center'},
                {title: 'LastVisit Referral Code', alignment: 'center'},
                {title: 'LastVisit Referral Info Html', alignment: 'center'},
                {title: 'LastVisit Referral URL', alignment: 'center'},
                {title: 'LastVisit Source', alignment: 'center'},
                {title: 'LastVisit Source Description', alignment: 'center'},
                {title: 'LastVisit Source Type', alignment: 'center'},
                {title: 'LastVisit UTM Campaign', alignment: 'center'},
                {title: 'LastVisit UTM Content', alignment: 'center'},
                {title: 'LastVisit UTM Medium', alignment: 'center'},
                {title: 'LastVisit UTM Source', alignment: 'center'},
                {title: 'LastVisit UTM Term', alignment: 'center'},
              ]}
            >
            { rowMarkup }
          </IndexTable>
        </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
