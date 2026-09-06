import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function GalleryLightbox({
  images,
  openIndex,
  onClose,
  onNavigate,
  altPrefix,
}: {
  images: string[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  altPrefix: string;
}) {
  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(((openIndex! - 1) + images.length) % images.length);
      if (event.key === "ArrowRight") onNavigate((openIndex! + 1) % images.length);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, openIndex, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="gallery-lightbox__close" onClick={onClose} aria-label="Kapat">
        <X size={22} />
      </button>
      {images.length > 1 && (
        <button
          type="button"
          className="gallery-lightbox__nav gallery-lightbox__nav--prev"
          onClick={(event) => { event.stopPropagation(); onNavigate(((openIndex! - 1) + images.length) % images.length); }}
          aria-label="Önceki fotoğraf"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      <img
        className="gallery-lightbox__image"
        src={images[openIndex!]}
        alt={`${altPrefix} ${openIndex! + 1}`}
        onClick={(event) => event.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          type="button"
          className="gallery-lightbox__nav gallery-lightbox__nav--next"
          onClick={(event) => { event.stopPropagation(); onNavigate((openIndex! + 1) % images.length); }}
          aria-label="Sonraki fotoğraf"
        >
          <ChevronRight size={28} />
        </button>
      )}
      {images.length > 1 && (
        <span className="gallery-lightbox__counter">{openIndex! + 1} / {images.length}</span>
      )}
    </div>
  );
}
