'use client';

import React from 'react';

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Shipping & Returns</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 29 December 2025</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        {/* Shipping Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Shipping Policy</h2>
          <p>
            House of Sizzo ships nationwide from Victoria, Australia. We strive to deliver a seamless, luxury-grade experience from checkout to doorstep, whether you are in a major city or a remote location.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Order Processing</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders are processed and dispatched within 1–3 business days from our fulfilment centre.</li>
            <li>Orders placed on weekends or public holidays will be dispatched on the next business day.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-1">Delivery Timeframe</h3>
          <p>Estimated delivery once dispatched:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>10–15 business days Australia-wide.</li>
          </ul>
          <p>Delivery may take longer during peak periods, due to carrier delays, or remote locations.</p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Shipping Costs</h3>
          <p>
            Shipping charges are calculated at checkout depending on product size, weight, and destination, and are displayed before payment.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Order Tracking</h3>
          <p>
            Once your order has been dispatched, you will receive an email with a tracking number to monitor your delivery.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Delivery Issues</h3>
          <p>
            If your order does not arrive on time, or arrives damaged or incomplete, contact us at{' '}
            <a href="mailto:support@houseofsizzo.com.au" className="underline text-[#8499b8]">support@houseofsizzo.com.au</a>.
          </p>
        </section>

        {/* Returns Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Returns & Refunds</h2>
          <p>
            House of Sizzo curates its products with exclusivity, care, and high standards in mind. To maintain integrity and luxury service, we operate under the following policy:
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">No Returns for Change of Mind</h3>
          <p>
            We do not accept returns, exchanges, or refunds if you change your mind for any reason, including colour, style preference, or personal choice.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Faulty, Damaged, or Incorrect Items — Your Rights Under Law</h3>
          <p>
            Your statutory rights under the Australian Consumer Law (ACL) remain fully protected. If you receive an item that is damaged, faulty, or significantly different from the description, you are entitled to a refund, repair, or replacement.
          </p>
          <p>To make a claim:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact us at <a href="mailto:support@houseofsizzo.com.au" className="underline text-[#8499b8]">support@houseofsizzo.com.au</a> within 7 days of delivery.</li>
            <li>Provide your order number, description of the issue, and clear photos showing damage or defect.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-1">Non-Returnable Items</h3>
          <p>
            All items — unless faulty or incorrectly described — are non-returnable under change-of-mind circumstances.
          </p>
        </section>
      </div>
    </div>
  );
}
