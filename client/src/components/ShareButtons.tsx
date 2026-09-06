import { useState } from "react";
import { Check, Copy } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="16" height="16">
      <path fill="currentColor" d="M16 2.7a13.3 13.3 0 0 0-11.4 20.1L3 29l6.4-1.6A13.3 13.3 0 1 0 16 2.7Zm0 24.2a10.8 10.8 0 0 1-5.5-1.5l-.4-.2-3.8.9 1-3.7-.3-.4A10.8 10.8 0 1 1 16 26.9Zm5.9-8.1c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-2.6-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1a12.5 12.5 0 0 0 4.8 4.6c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4Z" />
    </svg>
  );
}

export default function ShareButtons({ url, title, whatsappLabel, copyLabel, copiedLabel }: { url: string; title: string; whatsappLabel: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, the link is still visible in the address bar.
    }
  };

  return (
    <div className="share-buttons">
      <a
        className="share-buttons__btn share-buttons__btn--whatsapp"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon /> {whatsappLabel}
      </a>
      <button type="button" className="share-buttons__btn" onClick={copyLink}>
        {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
