const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2026-07";

export const shopifyEnabled = Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);

/** Requête GraphQL vers la Storefront API. Usage strictement côté serveur (jeton privé). */
async function shopifyFetch(query, variables = {}) {
  if (!shopifyEnabled) {
    throw new Error("Shopify n'est pas configuré (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN manquants).");
  }

  const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }
  return json.data;
}

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  availableForSale
  featuredImage { url altText }
  images(first: 10) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
`;

/** Liste des produits publiés sur la boutique Shopify (lecture seule). */
export async function getShopifyProducts(first = 50) {
  const data = await shopifyFetch(
    `query Products($first: Int!) {
      products(first: $first) {
        nodes { ${PRODUCT_FIELDS} }
      }
    }`,
    { first }
  );
  return data.products.nodes;
}

export async function getShopifyProductByHandle(handle) {
  const data = await shopifyFetch(
    `query Product($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle }
  );
  return data.product;
}

/** docId = la partie numérique de l'ID Shopify (voir shopifyGidToDocId). */
export async function getShopifyProductById(docId) {
  const data = await shopifyFetch(
    `query Product($id: ID!) {
      product(id: $id) { ${PRODUCT_FIELDS} }
    }`,
    { id: `gid://shopify/Product/${docId}` }
  );
  return data.product;
}
