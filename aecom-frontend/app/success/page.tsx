"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "edge"; // optional but helps NEXT STOP SSR

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

interface SessionData {
  customer_email?: string;
  amount_total?: number;
  currency?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`, {
          cache: "no-store",
        });

        const data = await res.json();
        setSession(data);

        clearCart();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  if (!session) return <p className="p-8 text-center">No session found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Thank you for your order!</h1>

      <p className="text-gray-700 mb-2">
        {session.customer_email
          ? `A receipt has been sent to ${session.customer_email}.`
          : "Check your email for a receipt."}
      </p>

      <p className="text-gray-700 mb-6">
        {session.amount_total
          ? `Total Paid: $${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase()}`
          : ""}
      </p>

      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-[#8499b8] hover:bg-[#6f86a4] text-white rounded cursor-pointer"
      >
        Go Back to Home
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
