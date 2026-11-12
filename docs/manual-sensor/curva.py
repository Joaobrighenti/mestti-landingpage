"""Gera o @keyframes ms-dwell de css/manual-sensor.css (pausa suave em cada passo).

Velocidade do conteúdo em relação à rolagem: 1 − (1 − m)/2 · (1 − cos 2πt), com m = velocidade mínima.
Deslocamento acumulado: D · F(t), F(t) = t − sin(2πt)/2π. Janela L = 2D/(1 − m), centrada no trecho extra D.
"""
import math
m, Dv = 0.35, 60
L = 2 * Dv / (1 - m); X = (L - Dv) / 2
F = lambda t: t - math.sin(2 * math.pi * t) / (2 * math.pi)
print(f"animation-range: cover {100 - X:.2f}svh cover {100 + Dv + X:.2f}svh;")
for i in range(41):
    t = i / 40; out = max(0, (t - .62) / .38)
    print(f"{t * 100:.1f}% {{ transform: translate3d(0, {Dv * F(t):.3f}svh, 0); opacity: {1 - out * out * .7:.3f}; }}")
