import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, { apiVersion: "2022-11-15" as any });

const STRAPI_URL = process.env.STRAPI_URL!;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN!;

// ------------------------------
// REDUCE VARIANT STOCK (ALLOW NEGATIVE)
// ------------------------------
async function reduceVariantStock(sku: string, quantity: number) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?populate[0]=variants`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    for (const product of data.data) {
      const variants = product.variants || [];
      const variant = variants.find((v: any) => v.sku === sku);

      if (!variant) continue;

      const oldStock = variant.stock || 0;
      const newStock = oldStock - quantity; // ALLOW NEGATIVE

      console.log(`📦 Adjusting stock: ${sku} ${oldStock} → ${newStock}`);

      const updatedVariants = variants.map((v: any) =>
        v.sku === sku ? { ...v, stock: newStock } : v
      );

      const updateRes = await fetch(`${STRAPI_URL}/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ data: { variants: updatedVariants } }),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        throw new Error(`Strapi stock update failed: ${errorText}`);
      }

      console.log(`✅ Stock updated for SKU ${sku}`);
      return;
    }

    console.warn(`⚠ No variant found with SKU ${sku}`);
  } catch (err: any) {
    console.error(`❌ reduceVariantStock error for ${sku}: ${err.message}`);
    throw err;
  }
}

// ------------------------------
// FIND PRODUCT BY SKU
// ------------------------------
async function findProductByVariantSku(sku: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?populate[0]=variants`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);

    const data = await res.json();

    for (const product of data.data) {
      const variant = product.variants?.find((v: any) => v.sku === sku);
      if (variant) {
        return { productId: product.id, variant, quantity: 0 };
      }
    }

    console.warn(`⚠ No product found for SKU: ${sku}`);
    return null;
  } catch (err: any) {
    console.error(`❌ Error finding product by SKU ${sku}: ${err.message}`);
    return null;
  }
}

// ------------------------------
// GET SKU FROM LINE ITEM
// ------------------------------
async function getSkuFromLineItem(item: Stripe.LineItem) {
  try {
    if (item.price?.metadata?.sku) return item.price.metadata.sku;
// @ts-ignore
    if (typeof item.price?.product === "object" && item.price.product.metadata?.sku)
      // @ts-ignore
      return item.price.product.metadata.sku;

    if (typeof item.price?.product === "string") {
      const product = await stripe.products.retrieve(item.price.product);
      return product.metadata?.sku ?? null;
    }

    return null;
  } catch (err: any) {
    console.error(`❌ Error retrieving SKU for line item ${item.id}: ${err.message}`);
    return null;
  }
}

// ------------------------------
// CREATE ORDER IN STRAPI
// ------------------------------
async function createOrderInStrapi(orderData: any) {
  const res = await fetch(`${STRAPI_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: orderData }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create order in Strapi: ${text}`);
  }

  return res.json();
}

// ------------------------------
// WEBHOOK HANDLER
// ------------------------------
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const buf = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`📨 Received Stripe event: ${event.type}`);

  if (event.type !== "checkout.session.completed") {
    console.log(`ℹ Event type ${event.type} not handled`);
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  let lineItems: Stripe.ApiList<Stripe.LineItem>;
  try {
    lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ["data.price.product"] });
  } catch (err: any) {
    console.error("❌ Could not fetch line items:", err.message);
    return NextResponse.json({ error: "Failed to fetch line items" }, { status: 500 });
  }

  try {
    const productsWithVariants: any[] = [];

    for (const item of lineItems.data) {
      const sku = await getSkuFromLineItem(item);
      if (!sku) continue;

      const productInfo = await findProductByVariantSku(sku);
      if (!productInfo) continue;

      productInfo.quantity = item.quantity || 1;
      productsWithVariants.push(productInfo);
    }

    if (productsWithVariants.length === 0) {
      console.error("❌ No valid products found in line items");
      return NextResponse.json({ error: "No valid products found. Check SKUs." }, { status: 400 });
    }

    // Create order payload
    const shippingDetails = session.customer_details?.address || {};
    const orderData = {
      products: productsWithVariants.map(p => p.productId),
      orderItems: productsWithVariants.map(p => ({
        product: p.productId,
        variantSku: p.variant.sku,
        variantName: p.variant.name || `${p.variant.size} ${p.variant.colour}`.trim(),
        variantSize: p.variant.size || "",
        variantColour: p.variant.colour || "",
        quantity: p.quantity,
        price: p.variant.price || 0,
      })),
      totalPrice: (session.amount_total ?? 0) / 100,
      orderStatus: session.payment_status === "paid" ? "paid" : "pending",
      shippingAddress: {
        // @ts-ignore
        street: shippingDetails.line1 || "",
        // @ts-ignore
        city: shippingDetails.city || "",
        // @ts-ignore
        State: shippingDetails.state || "",
        // @ts-ignore
        postalCode: shippingDetails.postal_code || "",
        // @ts-ignore
        country: shippingDetails.country || "",
      },
      orderCreatedAt: new Date().toISOString(),
      orderUpdatedAt: new Date().toISOString(),
      stripe_session_id: session.id,
      email: session.customer_email ?? session.customer_details?.email ?? "",
    };

    console.log("📝 Creating order in Strapi:", JSON.stringify(orderData, null, 2));
    const order = await createOrderInStrapi(orderData);

    console.log("✅ Order created with ID:", order.data.id);

    // Reduce stock for all variants
    for (const p of productsWithVariants) {
      await reduceVariantStock(p.variant.sku, p.quantity);
    }

    console.log("✅ Order processing completed successfully!");
    return NextResponse.json({ received: true, orderId: order.data.id });
  } catch (err: any) {
    console.error("❌ Error processing order:", err.message);
    return NextResponse.json({ error: `Order processing failed: ${err.message}` }, { status: 500 });
  }
}
