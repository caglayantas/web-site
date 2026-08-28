from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/webdev-static-assets')

jobs = [
    ('source-electrical-service.webp', 'perla-marine-electrical-system-crop.webp', (1000, 120, 1920, 733)),
    ('source-electronics-service.webp', 'perla-marine-electronics-system-crop.webp', (120, 120, 1320, 920)),
    ('source-climate-service.webp', 'perla-marine-hvac-webasto-system-crop.webp', (600, 100, 1920, 980)),
]

for source_name, output_name, box in jobs:
    source = Image.open(root / source_name).convert('RGB')
    cropped = source.crop(box).resize((1920, 1280), Image.Resampling.LANCZOS)
    cropped.save(root / output_name, quality=92, optimize=True)
    print(output_name, cropped.size)
