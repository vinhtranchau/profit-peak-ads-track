import { useNavigation } from "@remix-run/react";
import {
  Page,
  Layout
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  return null;
};

export default function Index() {
  const nav = useNavigation();
  
  const isLoading = ["loading"].includes(nav.state);

  const enableTracker = async () => {
    const response = await fetch("/api/webpixel", {
      method: "POST"
    });
    const data = await response.json();

    shopify.toast.show("Tracker Installed!");
  };

  return (
    <Page fullWidth>
      <ui-title-bar title="Profit Peak Ads Track">
        <button variant="primary" onClick={enableTracker}>
          Enable Tracker
        </button>
      </ui-title-bar>
      <Layout>
      </Layout>
    </Page>
  );
}