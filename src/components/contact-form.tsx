"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { enquiryInput } from "@/lib/admin-validation";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWhatsapp("");
    setSent(false);
    setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const data = {
        ...Object.fromEntries(form),
        consent: form.get("consent") === "on",
      };
      const parsed = enquiryInput(data);
      setWhatsapp(
        buildWhatsAppUrl(
          `Hello Trimurti Coolers,\nName: ${parsed.name}\nPhone: ${parsed.phone}\n${parsed.email ? `Email: ${parsed.email}\n` : ""}\n${parsed.message}`,
        ),
      );
      const response = await fetch("/api/enquiries", {
        signal: AbortSignal.timeout(15000),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Could not send your enquiry. Please try WhatsApp.",
        );
      setSent(true);
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Could not send your enquiry. Your message is still here.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-form-layout">
      <div>
        <p className="eyebrow light">Send an enquiry</p>
        <h3>Let’s find your cooler.</h3>
        <p>Tell us about your space and the cooler you have in mind.</p>
        <small>
          Online enquiries are opening soon. You can prepare your message here
          and send it directly on WhatsApp.
        </small>
      </div>
      <form className="contact-form admin-form" onSubmit={submit}>
        <div className="admin-fields">
          <label>
            Your name *
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
          <label>
            Phone number *
            <input
              name="phone"
              required
              type="tel"
              maxLength={24}
              autoComplete="tel"
              placeholder="+91"
            />
          </label>
        </div>
        <label>
          Email (optional)
          <input
            name="email"
            type="email"
            maxLength={200}
            autoComplete="email"
          />
        </label>
        <label>
          Your message *
          <textarea
            name="message"
            rows={4}
            required
            maxLength={3000}
            placeholder="Which cooler or space would you like help with?"
          />
        </label>
        <div className="form-honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              maxLength={200}
            />
          </label>
        </div>
        <label className="form-check">
          <input name="consent" type="checkbox" required /> I agree to be
          contacted by Trimurti Coolers about this enquiry.
        </label>
        <p className="contact-privacy-note">
          Your contact details are used to respond to your enquiry. No marketing
          subscription is created.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {sent && <p role="status">Thank you for your enquiry.</p>}
        <div className="contact-form-actions">
          <button className="button button-light" disabled={busy}>
            {busy ? "Sending…" : "Send enquiry"}
            <Send size={17} />
          </button>
          {whatsapp && (
            <a
              className="button button-light"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Send this message on WhatsApp <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
