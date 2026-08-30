import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const CIRCUMFERENCE = 2 * Math.PI * 19;
type ButtonTone = "dark" | "light";

function getRgbChannels(color: string) {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const channels = match[1].split(",").map((channel) => Number.parseFloat(channel.trim()));
  if (channels.length < 3 || channels.some((channel) => Number.isNaN(channel))) return null;
  if (channels.length === 4 && channels[3] === 0) return null;
  return channels.slice(0, 3);
}

function getSectionTone(): ButtonTone {
  const pointX = Math.max(window.innerWidth - 48, 0);
  const pointY = Math.max(window.innerHeight - 48, 0);
  const elements = document.elementsFromPoint(pointX, pointY);
  const candidates = elements.filter((element) => !(element as HTMLElement).closest(".back-to-top"));

  for (const element of candidates) {
    const computed = window.getComputedStyle(element);
    const rgb = getRgbChannels(computed.backgroundColor);
    if (rgb) {
      const [red, green, blue] = rgb;
      const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
      return luminance > 0.62 ? "light" : "dark";
    }
    if (computed.backgroundImage !== "none") return "dark";
  }

  const bodyRgb = getRgbChannels(window.getComputedStyle(document.body).backgroundColor) ?? [255, 253, 248];
  const luminance = (0.2126 * bodyRgb[0] + 0.7152 * bodyRgb[1] + 0.0722 * bodyRgb[2]) / 255;
  return luminance > 0.62 ? "light" : "dark";
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tone, setTone] = useState<ButtonTone>("dark");

  useEffect(() => {
    let frame = 0;
    let lastToneCheck = 0;
    const updateScrollState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame((now) => {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const nextProgress = Math.min(Math.max((window.scrollY / maxScroll) * 100, 0), 100);
        setProgress(nextProgress);
        setVisible(window.scrollY > 480);
        // getSectionTone() forces a layout (elementsFromPoint + getComputedStyle); only
        // recompute it a few times a second instead of on every scroll frame.
        if (now - lastToneCheck > 200) {
          lastToneCheck = now;
          setTone(getSectionTone());
        }
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <button
      className={`back-to-top back-to-top--on-${tone} ${visible ? "back-to-top--visible" : ""}`}
      type="button"
      onClick={scrollToTop}
      aria-label={`Sayfanın en üstüne dön — sayfa ilerlemesi yüzde ${Math.round(progress)}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg className="back-to-top__progress" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="back-to-top__track" cx="22" cy="22" r="19" />
        <circle className="back-to-top__indicator" cx="22" cy="22" r="19" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset} />
      </svg>
      <ArrowUp className="back-to-top__icon" size={17} aria-hidden="true" />
    </button>
  );
}
