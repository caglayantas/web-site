import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MoveHorizontal } from "lucide-react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  label: string;
};

export default function BeforeAfterSlider({ before, after, beforeAlt, afterAlt, label }: BeforeAfterSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const rafRef = useRef<number | null>(null);
  const pendingClientX = useRef<number | null>(null);

  const dismissHint = () => setShowHint(false);
  const applyPosition = (clientX: number) => {
    const element = sliderRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    setPosition(Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100)));
  };
  const updatePosition = useCallback((clientX: number) => {
    pendingClientX.current = clientX;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingClientX.current !== null) applyPosition(pendingClientX.current);
    });
  }, []);
  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  const stopDrag = () => setDragging(false);
  const startDrag = (event: PointerEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dismissHint();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updatePosition(event.clientX);
  };
  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    event.preventDefault();
    updatePosition(event.clientX);
  };
  const handleSurfacePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, input")) return;
    startDrag(event);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    dismissHint();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => Math.max(4, current - 5));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => Math.min(96, current + 5));
    }
    if (event.key === "Home") setPosition(4);
    if (event.key === "End") setPosition(96);
  };

  const beforeLabelOpacity = Math.max(0.22, Math.min(1, position / 50));
  const afterLabelOpacity = Math.max(0.22, Math.min(1, (100 - position) / 50));
  const beforeLabelActive = position >= 50;
  const afterLabelActive = position <= 50;

  return (
    <div
      ref={sliderRef}
      className={`before-after-slider${dragging ? " is-dragging" : ""}`}
      onPointerDownCapture={handleSurfacePointerDown}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <img className="before-after-slider__blur-bg" src={after} alt="" aria-hidden="true" />
      <img className="before-after-slider__image before-after-slider__image--after" src={after} alt={afterAlt} />
      <div className="before-after-slider__before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img className="before-after-slider__image" src={before} alt={beforeAlt} />
      </div>
      <div className="before-after-slider__divider" style={{ left: `${position}%` }} aria-hidden="true" />
      <span className={`before-after-slider__label before-after-slider__label--before${beforeLabelActive ? " is-active" : " is-muted"}`} style={{ opacity: beforeLabelOpacity }}>ÖNCE</span>
      <span className={`before-after-slider__label before-after-slider__label--after${afterLabelActive ? " is-active" : " is-muted"}`} style={{ opacity: afterLabelOpacity }}>SONRA</span>
      {showHint && <span className="before-after-slider__hint"><MoveHorizontal size={14} aria-hidden="true" /><span className="before-after-slider__hint-long">Tutarak sağa-sola sürükleyin</span><span className="before-after-slider__hint-short">Sürükleyin</span></span>}
      <button
        className="before-after-slider__handle"
        style={{ left: `${position}%` }}
        type="button"
        role="slider"
        aria-label={`${label} önce ve sonra karşılaştırması`}
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <span aria-hidden="true">↔</span>
      </button>
    </div>
  );
}
