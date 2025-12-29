'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: December 2025</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          At <strong>House of Sizzo</strong>, your privacy is of paramount importance. We are
          committed to protecting your personal information in accordance with the
          <strong> Privacy Act 1988 (Cth)</strong> and the Australian Privacy Principles (APPs).
          This Privacy Policy explains how we collect, use, disclose, and protect your
          personal information when you visit or make a purchase from{' '}
          <a href="https://www.houseofsizzo.com.au" className="underline text-[#8499b8]">
            houseofsizzo.com.au
          </a>.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, delivery and billing address, email address, and phone number</li>
            <li>Order and transaction details</li>
            <li>Device, browser, and usage data including IP address and browsing behaviour</li>
          </ul>
          <p className="mt-3">
            Payments are processed securely through third-party payment providers. We do not
            store or have access to your card details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How We Collect Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Placing an order or creating an account</li>
            <li>Subscribing to our newsletter or updates</li>
            <li>Submitting a contact or enquiry form</li>
            <li>Browsing and interacting with our website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfil orders</li>
            <li>To communicate about orders or enquiries</li>
            <li>To improve and personalise your experience</li>
            <li>To send marketing communications where you have opted in</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Disclosure of Information</h2>
          <p className="mb-2">We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Delivery and courier partners</li>
            <li>Secure payment processors</li>
            <li>IT and technical service providers</li>
            <li>Regulatory or legal authorities where required by law</li>
          </ul>
          <p className="mt-3">We do not sell or trade your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to support website functionality and
            analytics. You may disable cookies in your browser settings, however some features
            of the site may not function correctly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Data Security and Access</h2>
          <p>
            We take reasonable steps to protect your personal information. You may request
            access to or correction of your data by contacting us at{' '}
            <a href="mailto:support@houseofsizzo.com.au" className="underline text-[#8499b8]">
              support@houseofsizzo.com.au
            </a>.
          </p>
        </section>

        <section className="border-t pt-6 text-sm text-gray-500">
          <p>
            House of Sizzo<br />
            ABN 30 140 440 157<br />
            Contact:{' '}
            <a href="mailto:support@houseofsizzo.com.au" className="underline text-[#8499b8]">
              support@houseofsizzo.com.au
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
