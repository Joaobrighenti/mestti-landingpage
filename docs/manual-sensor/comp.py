"""Junta o passe de linhas e o de sombreamento em um WebP com alfa, por tema.

python3 comp.py <dir_render> <dir_saida> <tamanho> [qualidade]
"""
import sys, os, glob
import numpy as np
from PIL import Image

src, dst, size = sys.argv[1], sys.argv[2], int(sys.argv[3])
q = int(sys.argv[4]) if len(sys.argv) > 4 else 82
os.makedirs(dst, exist_ok=True)

THEMES = {
    # tinta, destaque
    'l': ((0x15, 0x34, 0x4a), (0x03, 0x69, 0xa1)),
    'd': ((0xd6, 0xe4, 0xee), (0x8a, 0xcb, 0xfa)),
}

def over(c_top, a_top, c_bot, a_bot):
    a = a_top + a_bot * (1 - a_top)
    c = (c_top * a_top[..., None] + c_bot * (a_bot * (1 - a_top))[..., None]) / np.maximum(a, 1e-6)[..., None]
    return c, a

for lp in sorted(glob.glob(os.path.join(src, '*_l.png'))):
    n = os.path.basename(lp)[:-6]
    L = np.asarray(Image.open(lp).convert('RGBA')).astype(np.float32) / 255
    S = np.asarray(Image.open(lp[:-6] + '_s.png').convert('RGBA')).astype(np.float32) / 255
    a = L[..., 3]
    R, G = L[..., 0], L[..., 1]
    acc = np.clip(R - G, 0, 1) * a
    neu = np.clip(1 - R, 0, 1) * a
    # preenchimento: silhueta quase transparente, um pouco mais densa onde a luz do estúdio escurece
    lum = S[..., :3].mean(-1)
    fill = S[..., 3] * (0.015 + 0.07 * np.clip(1 - lum, 0, 1) ** 1.3)
    for t, (ink, accent) in [(k, v) for k, v in THEMES.items() if k in os.environ.get('THEMES', 'l')]:
        ink = np.array(ink, np.float32) / 255; accent = np.array(accent, np.float32) / 255
        H, W = a.shape
        c = np.broadcast_to(ink, (H, W, 3)).copy(); al = fill.copy()
        c, al = over(np.broadcast_to(accent, (H, W, 3)), np.clip(np.where(acc > 0.5, acc, acc * 0.35), 0, 1), c, al)
        c, al = over(np.broadcast_to(ink, (H, W, 3)), np.clip(neu * 0.92, 0, 1), c, al)
        img = np.dstack([c, al])
        im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8), 'RGBA').resize((size, size), Image.LANCZOS)
        im.save(os.path.join(dst, f'{n}-{t}.webp'), 'WEBP', quality=q, method=6, alpha_quality=90)
    print(n)
