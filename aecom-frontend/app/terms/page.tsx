'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 29 December 2025</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          These Terms and Conditions govern your use of <a href="https://www.houseofsizzo.com.au" className="underline text-[#8499b8]">houseofsizzo.com.au</a> and any purchases from House of Sizzo. By using our website or placing an order, you accept and agree to be bound by these Terms and our Privacy Policy.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">Acceptance & Agreement</h2>
          <p>
            By browsing or ordering, you confirm you have read, understood, and agree to these Terms, together with our Privacy Policy, Shipping Policy, and Returns Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Product Descriptions & Imagery</h2>
          <p>
            We endeavour to present all items with high-quality photos and accurate descriptions. Slight variations in colour, texture, or sizing may occur due to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Individual screen settings such as brightness and contrast</li>
            <li>Lighting, material finishes, or natural production variances</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are in AUD and include GST, unless stated otherwise.</li>
            <li>We reserve the right to modify prices at any time; if a change occurs after an order is placed, we will contact you before processing payment.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Orders & Cancellation</h2>
          <p>
            We reserve the right to refuse or cancel orders due to stock unavailability, pricing/listing errors, or suspected fraudulent activity. If cancelled after payment, a full refund will be issued.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All content on <a href="https://www.houseofsizzo.com.au" className="underline text-[#8499b8]">houseofsizzo.com.au</a> — including text, images, logos, product designs, and branding — is the exclusive property of House of Sizzo. No part may be reproduced, distributed, or used without written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Australian law, House of Sizzo is not liable for delays caused by third-party couriers, loss, damage, misuse of products after delivery, or indirect, incidental, or consequential losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
          <p>
            These Terms are governed by the laws of Victoria, Australia. Any dispute arising under or in connection with these Terms will be subject to the jurisdiction of the courts of Victoria.
          </p>
        </section>

        <section className="border-t pt-6 text-sm text-gray-500">
          <p>
            House of Sizzo<br />
            ABN 30 140 440 157<br />
            Contact: <a href="mailto:support@houseofsizzo.com.au" className="underline text-[#8499b8]">support@houseofsizzo.com.au</a>
          </p>
        </section>
      </div>
    </div>
  );
}
