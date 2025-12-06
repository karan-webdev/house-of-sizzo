// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    console.log("📦 Received checkout items:", JSON.stringify(items, null, 2));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: undefined, // Stripe will collect email
      shipping_address_collection: {
        allowed_countries: ["AU"],
      },
      billing_address_collection: "required",

      line_items: items.map((item: any) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: `${item.title} - ${item.variantName}`, // Include variant info in name
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              sku: item.sku, // ⭐ THIS IS THE KEY! Pass SKU in metadata
              productId: item.id?.toString() || "",
              variantId: item.variantId?.toString() || "",
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    console.log("✅ Stripe session created:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}