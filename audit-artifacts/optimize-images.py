from pathlib import Path
from io import BytesIO
from urllib.request import Request, urlopen
from PIL import Image

assets = {
    "perla-hero-medium-yacht-service_7ccec84c.jpg": "https://perlamarine-zbulf29n.manus.space/manus-storage/perla-hero-medium-yacht-service_7ccec84c.jpg",
    "perla-service-electrical_bfa1b249.jpg": "https://perlamarine-zbulf29n.manus.space/manus-storage/perla-service-electrical_bfa1b249.jpg",
    "perla-service-marine-electronics_a9f3a57f.jpg": "https://perlamarine-zbulf29n.manus.space/manus-storage/perla-service-marine-electronics_a9f3a57f.jpg",
    "perla-service-climate_42d8f6ac.jpg": "https://perlamarine-zbulf29n.manus.space/manus-storage/perla-service-climate_42d8f6ac.jpg",
}
out = Path("/home/ubuntu/webdev-static-assets/perla-optimized")
out.mkdir(parents=True, exist_ok=True)
for name, url in assets.items():
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    source = Image.open(BytesIO(urlopen(request, timeout=30).read())).convert("RGB")
    source.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
    target = out / f"{Path(name).stem}.webp"
    source.save(target, "WEBP", quality=78, method=6)
    print(f"{name} -> {target} {target.stat().st_size} bytes {source.size}")
