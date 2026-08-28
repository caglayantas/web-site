from __future__ import annotations


def luminance(hex_color: str) -> float:
    value = hex_color.lstrip("#")
    channels = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    linear = [channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4 for channel in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def contrast(first: str, second: str) -> float:
    light, dark = sorted((luminance(first), luminance(second)), reverse=True)
    return (light + 0.05) / (dark + 0.05)

pairs = {
    "hero white on deep navy": ("#FFFDF8", "#041F3D"),
    "hero gold-light on deep navy": ("#E0BF7B", "#041F3D"),
    "navy on paper": ("#073A6B", "#FFFDF8"),
    "slate on paper": ("#546373", "#FFFDF8"),
    "gold on deep navy": ("#C79B48", "#041F3D"),
}

for name, (foreground, background) in pairs.items():
    print(f"{name}: {contrast(foreground, background):.2f}:1")
