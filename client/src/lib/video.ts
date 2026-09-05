export type VideoEmbed = { platform: "youtube" | "instagram"; embedUrl: string } | null;

/**
 * Turns a YouTube or Instagram Reel/post URL (as pasted by an admin) into an
 * embeddable iframe source. Returns null for anything else so callers can
 * silently skip rendering rather than show a broken embed.
 */
export function getVideoEmbed(rawUrl: string): VideoEmbed {
  const url = rawUrl.trim();
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return { platform: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        if (id) return { platform: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
      }
      const shortsMatch = parsed.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shortsMatch) return { platform: "youtube", embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}` };
      const embedMatch = parsed.pathname.match(/^\/embed\/([\w-]+)/);
      if (embedMatch) return { platform: "youtube", embedUrl: url };
    }

    if (host === "instagram.com") {
      const match = parsed.pathname.match(/^\/(reel|p|tv)\/([\w-]+)/);
      if (match) return { platform: "instagram", embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed` };
    }
  } catch {
    return null;
  }

  return null;
}
