from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/webdev-static-assets')
for src in sorted(root.glob('perla-service-*-v2.jpg')):
    with Image.open(src) as image:
        image = image.convert('RGB')
        image.thumbnail((1600, 1067), Image.Resampling.LANCZOS)
        dest = src.with_suffix('.webp')
        image.save(dest, 'WEBP', quality=78, method=6)
        print(f'{src.name}: {src.stat().st_size} -> {dest.name}: {dest.stat().st_size} ({image.width}x{image.height})')
