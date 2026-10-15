"use client";

import { useState } from "react";
import { Button } from "@/design-system/Button";

/** Ways to keep or pass on a ticket: share sheet, WhatsApp, copy link, print or save as PDF. */
export function TicketActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `My ticket for ${title}`;

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: text, url }).catch(() => undefined);
      return;
    }
    await copy();
  }

  async function copy() {
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 print:hidden">
      <Button type="button" onClick={share}>Share ticket</Button>
      <Button asChild variant="secondary">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`} target="_blank" rel="noopener noreferrer">
          Send to WhatsApp
        </a>
      </Button>
      <Button type="button" variant="secondary" onClick={copy}>{copied ? "Link copied" : "Copy link"}</Button>
      <Button type="button" variant="secondary" onClick={() => window.print()}>Print or save PDF</Button>
    </div>
  );
}
