# Ilustrações do manual do sensor de corrente

As imagens de `images/manual/sensor-de-corrente/` saem destes dois scripts (Blender 5.2, Freestyle em Workbench).

```bash
RES=1200 blender -b --factory-startup --python kit.py -- /tmp/r/hero hero 36    # giro da abertura
RES=1200 blender -b --factory-startup --python kit.py -- /tmp/r/clamp clamp 40  # pinça abrindo e fechando
RES=1200 blender -b --factory-startup --python kit.py -- /tmp/r/sensor sensor   # também: sct, fonte, fita
python3 comp.py /tmp/r/hero /tmp/o/hero 720 80                                  # junta linhas + sombra em WebP
```

Cada quadro gera dois passes: linhas (preto = traço, vermelho = destaque, cinza = oculto) e sombreamento.
O `comp.py` pinta com a tinta e o azul do site e grava `NNN-l.webp`; a página usa esses arquivos sem o sufixo.
