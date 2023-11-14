import * as crypto from "crypto";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    mutation createWebPixel($webPixelInput: WebPixelInput!) {
      webPixelCreate(webPixel: $webPixelInput) {
        webPixel {
          settings
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `,
  {
    variables: {
      webPixelInput: {
        settings: {
          accountID: crypto.randomUUID()
        }
      }
    }
  });

  const responseJson = await response.json();

  const userErrors = responseJson?.data?.webPixelCreate?.userErrors;
  if (userErrors.length) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
  
  return null;
};