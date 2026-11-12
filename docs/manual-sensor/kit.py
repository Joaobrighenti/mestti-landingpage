"""Modela o kit do sensor de corrente Mestti e renderiza em traço (Freestyle).

blender -b --factory-startup --python kit.py -- <out_dir> <cena> [frames]
cena: hero | clamp | sensor | sct | fonte | fita
Cada quadro gera dois PNG: <n>_l.png (linhas, cor-chave) e <n>_s.png (sombreamento).
Linhas pretas = traço neutro; vermelho puro = traço de destaque; cinza = traço oculto.
"""
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT, SCENE = argv[0], argv[1]
FRAMES = int(argv[2]) if len(argv) > 2 else 1
RES = int(os.environ.get('RES', '1440'))
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
ACC = bpy.data.collections.new('accent'); sc.collection.children.link(ACC)
NEU = bpy.data.collections.new('neutral'); sc.collection.children.link(NEU)

def mat(name, color):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    return m
WHITE = mat('white', (1, 1, 1))
RED = mat('red', (1, .6, .6))

def put(o, accent=False):
    for c in o.users_collection: c.objects.unlink(o)
    (ACC if accent else NEU).objects.link(o)
    o.data.materials.clear(); o.data.materials.append(RED if accent else WHITE)
    return o

def bevel(o, w, seg=4):
    m = o.modifiers.new('bev', 'BEVEL'); m.width = w; m.segments = seg
    m.limit_method = 'ANGLE'; m.harden_normals = False
    return o

def box(size, loc, bev=0.0, seg=4, accent=False):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    put(o, accent)
    if bev: bevel(o, bev, seg)
    return o

def cyl(r, depth, loc, rot=(0, 0, 0), verts=48, accent=False, r2=None, bev=0.0):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    else:
        bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object; put(o, accent)
    if bev: bevel(o, bev, 3)
    return o

def cut(target, cutter):
    m = target.modifiers.new('cut', 'BOOLEAN'); m.operation = 'DIFFERENCE'; m.object = cutter; m.solver = 'EXACT'
    # o bevel vem depois do corte
    if 'bev' in target.modifiers:
        bpy.context.view_layer.objects.active = target
        bpy.ops.object.modifier_move_to_index(modifier='cut', index=0)
    cutter.hide_render = True; cutter.hide_viewport = True
    for c in cutter.users_collection: c.objects.unlink(cutter)
    sc.collection.objects.link(cutter)

def text(body, size, loc, rot=(math.pi / 2, 0, 0), extrude=0.03, accent=False):
    bpy.ops.object.text_add(location=loc, rotation=rot)
    o = bpy.context.object; o.data.body = body; o.data.size = size; o.data.extrude = extrude
    o.data.align_x = 'CENTER'; o.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    return put(bpy.context.object, accent)

def tube(points, r, accent=False, res=24):
    cu = bpy.data.curves.new('tube', 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 6; cu.resolution_u = res
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(points) - 1)
    for p, co in zip(sp.bezier_points, points):
        p.co = co; p.handle_left_type = p.handle_right_type = 'AUTO'
    o = bpy.data.objects.new('tube', cu); sc.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    for x in bpy.context.selected_objects:
        if x is not o: x.select_set(False)
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.object
    return put(o, accent)

def parent(children, p):
    bpy.context.view_layer.update()
    for c in children:
        mw = c.matrix_world.copy(); c.parent = p; c.matrix_world = mw

# ---------------------------------------------------------------- peças
# ---------------------------------------------------------------- peças
def sct(origin=(0, 0, 0)):
    """Pinça SCT-013 (31 × 54 × 26 mm), em pé, cabo para baixo.
    Janela quadrada de 13 mm no alto. O corpo e a tampa se dividem dentro da janela;
    a tampa gira na dobradiça da direita e trava com a aba nervurada da esquerda."""
    ox, oy, oz = origin
    W, D, H = 3.1, 2.6, 5.4
    split = 3.85
    wz, ws = 4.12, 1.3
    body = box((W, D, split), (ox, oy, oz + split / 2), bev=0.22)
    win = box((ws, D * 2, ws), (ox, oy, oz + wz), bev=0.12, seg=3); cut(body, win)
    jaw = box((W, D, H - split - 0.03), (ox, oy, oz + split + 0.03 + (H - split - 0.03) / 2), bev=0.22)
    win2 = box((ws, D * 2, ws), (ox, oy, oz + wz), bev=0.12, seg=3); cut(jaw, win2)
    # aba de trava: desce pela lateral esquerda, por fora do corpo
    flap = box((0.16, D * 0.72, 1.9), (ox - W / 2 - 0.08, oy, oz + split - 0.35), bev=0.06, seg=2)
    ribs = [box((0.06, D * 0.6, 0.07), (ox - W / 2 - 0.19, oy, oz + split - 1.05 + i * 0.2), bev=0.02, seg=1) for i in range(4)]
    # dobradiça à direita
    hinge = cyl(0.14, D * 0.8, (ox + W / 2 + 0.02, oy, oz + split), rot=(math.pi / 2, 0, 0), verts=20)
    t1 = text('SCT013', 0.36, (ox, oy - D / 2 - 0.012, oz + 2.25), extrude=0.008)
    t2 = text('100A:50mA', 0.27, (ox, oy - D / 2 - 0.012, oz + 1.62), extrude=0.008)
    relief = cyl(0.3, 0.45, (ox, oy, oz - 0.2), verts=32, bev=0.05)
    piv = bpy.data.objects.new('hinge', None); sc.collection.objects.link(piv)
    piv.location = (ox + W / 2 + 0.02, oy, oz + split)
    parent([jaw, flap, *ribs], piv)
    return piv, (ox, oy, oz + wz)

def fonte(origin=(0, 0, 0)):
    """Fonte de tomada 5 V 3 A, em pé: nervuras na frente e na lateral, pinos redondos num
    ressalto nas costas, cabo saindo por baixo, plugue micro USB e adaptador USB-C (destaque)."""
    ox, oy, oz = origin
    W, D, H = 3.9, 2.9, 6.4
    box((W, D, H), (ox, oy, oz), bev=0.55, seg=6)
    for i in range(11):
        z = oz + 2.3 - i * 0.42
        box((W - 0.9, 0.05, 0.13), (ox, oy - D / 2 - 0.01, z), bev=0.03, seg=1)
        box((0.05, D - 0.9, 0.13), (ox + W / 2 + 0.01, oy, z), bev=0.03, seg=1)
    py = oy + D / 2
    # base do plugue (formato Europlug: mais larga em cima, cantos de baixo arredondados)
    pz = oz + 0.9
    box((2.7, 1.25, 2.3), (ox, py + 0.6, pz), bev=0.5, seg=6)
    box((2.2, 0.06, 1.7), (ox, py + 1.25, pz), bev=0.3, seg=4)
    for s in (-1, 1):
        x = ox + s * 0.95
        # trecho isolado, anel de transição, metal e ponta arredondada
        cyl(0.2, 0.95, (x, py + 1.25 + 0.475, pz), rot=(math.pi / 2, 0, 0), verts=28)
        cyl(0.205, 0.04, (x, py + 2.22, pz), rot=(math.pi / 2, 0, 0), verts=28)
        cyl(0.19, 0.95, (x, py + 2.2 + 0.475, pz), rot=(math.pi / 2, 0, 0), verts=28)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.19, location=(x, py + 3.15, pz), segments=28, ring_count=14)
        put(bpy.context.object)
    a = Vector((ox - 0.6, oy, oz - H / 2 - 0.35))
    cyl(0.3, 0.7, (a.x, a.y, a.z + 0.05), verts=32, bev=0.05)
    pts = [a + Vector(v) for v in [(0, 0, -0.3), (0, -0.2, -1.3), (-1.2, -0.8, -2.7), (-3.4, -0.6, -2.5),
           (-3.9, 0.3, -0.8), (-2.9, 0.7, -0.4), (-2.6, 0.2, -1.6), (-3.4, -0.8, -3.6), (-4.6, -1.2, -4.4)]]
    tube(pts, 0.15)
    end = pts[-1]
    box((1.4, 0.8, 0.55), (end.x - 0.65, end.y, end.z), bev=0.2)
    box((0.95, 0.95, 0.6), (end.x - 1.8, end.y, end.z), bev=0.14, seg=3, accent=True)
    box((0.6, 0.84, 0.3), (end.x - 2.55, end.y, end.z), bev=0.14, seg=4, accent=True)

def liner_curl(x0, y0, z0, width, flat, curl, radius, axis_rot=0.0):
    """Protetor da fita: trecho plano e ponta enrolada para cima (malha feita à mão)."""
    import bmesh
    me = bpy.data.meshes.new('liner'); bm = bmesh.new()
    pts = [(x0 + u, z0) for u in [flat * i / 6 for i in range(7)]]
    n = 28
    for i in range(1, n + 1):
        a = curl / radius * i / n
        pts.append((x0 + flat + radius * math.sin(a), z0 + radius * (1 - math.cos(a))))
    rows = []
    for (x, z) in pts:
        rows.append((bm.verts.new((x, y0 - width / 2, z)), bm.verts.new((x, y0 + width / 2, z))))
    for (a1, b1), (a2, b2) in zip(rows, rows[1:]):
        bm.faces.new((a1, a2, b2, b1))
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('liner', me); sc.collection.objects.link(o)
    put(o)
    s = o.modifiers.new('sol', 'SOLIDIFY'); s.thickness = 0.03
    return o

def fita(origin=(0, 0, 0)):
    """Fita dupla face: espuma com o protetor descolando numa ponta."""
    ox, oy, oz = origin
    L, Wd = 4.4, 1.9
    foam = box((L, Wd, 0.22), (ox, oy, oz + 0.11), bev=0.05, seg=2)
    liner = liner_curl(ox - L / 2 + 0.02, oy, oz + 0.235, Wd - 0.04, L - 0.75, 1.05, 0.42)
    return [foam, liner]

def sensor_box(origin=(0, 0, 0), rot_z=0.0):
    """Caixa Mestti 90 × 60 × 35 mm com antena, USB-C à esquerda e saída de cabo à direita."""
    ox, oy, oz = origin
    W, D, H = 9.0, 3.5, 6.0
    root = bpy.data.objects.new('sensor', None); sc.collection.objects.link(root)
    root.location = origin
    parts = []
    body = box((W, D - 0.35, H), (ox, oy + 0.17, oz + H / 2), bev=0.45); parts.append(body)
    lid = box((W, 0.35, H), (ox, oy - D / 2 + 0.17, oz + H / 2), bev=0.2, seg=3); parts.append(lid)
    for sx in (-1, 1):
        for sz in (-1, 1):
            s = cyl(0.26, 0.08, (ox + sx * (W / 2 - 0.55), oy - D / 2 - 0.02, oz + H / 2 + sz * (H / 2 - 0.55)),
                    rot=(math.pi / 2, 0, 0), verts=32); parts.append(s)
            a = box((0.3, 0.03, 0.05), (s.location.x, oy - D / 2 - 0.07, s.location.z)); parts.append(a)
            b = box((0.05, 0.03, 0.3), (s.location.x, oy - D / 2 - 0.07, s.location.z)); parts.append(b)
    t = text('MESTTI', 1.15, (ox - 0.3, oy - D / 2 - 0.03, oz + H / 2), extrude=0.04); parts.append(t)
    led = cyl(0.13, 0.12, (ox + W / 2 - 1.5, oy - D / 2 - 0.03, oz + H - 1.25), rot=(math.pi / 2, 0, 0), verts=24)
    parts.append(led)
    # antena SMA no topo à direita
    ax = ox + W / 2 - 1.35
    nut = cyl(0.42, 0.28, (ax, oy + 0.2, oz + H + 0.14), verts=6); parts.append(nut)
    knurl = cyl(0.34, 0.75, (ax, oy + 0.2, oz + H + 0.65), verts=20); parts.append(knurl)
    base = cyl(0.3, 0.9, (ax, oy + 0.2, oz + H + 1.45), verts=32, bev=0.05); parts.append(base)
    ant = cyl(0.3, 7.4, (ax, oy + 0.2, oz + H + 5.6), verts=32, r2=0.2, bev=0.1); parts.append(ant)
    tip = bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, location=(ax, oy + 0.2, oz + H + 9.3), segments=24, ring_count=12)
    parts.append(put(bpy.context.object))
    # USB-C na lateral esquerda
    usb = box((0.06, 0.95, 0.36), (ox - W / 2 - 0.02, oy, oz + 1.6), bev=0.15, seg=4); parts.append(usb)
    # prensa-cabo à direita
    gland = cyl(0.42, 0.45, (ox + W / 2 + 0.2, oy, oz + 1.6), rot=(0, math.pi / 2, 0), verts=32, bev=0.06); parts.append(gland)
    parent(parts, root)
    root.rotation_euler.z = rot_z
    return root, (ox + W / 2 + 0.45, oy, oz + 1.6), (ox - W / 2 - 0.05, oy, oz + 1.6)

def setup(cam_loc, target, ortho=None, lens=60, hidden=True):
    r = sc.render
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    r.engine = 'BLENDER_WORKBENCH'
    r.resolution_x = r.resolution_y = RES
    r.film_transparent = True
    r.use_freestyle = True
    r.line_thickness_mode = 'ABSOLUTE'
    r.line_thickness = 1.0
    sc.display.render_aa = '8'
    sh = sc.display.shading
    sh.show_object_outline = False; sh.show_cavity = False; sh.show_shadows = False
    r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'
    vl = sc.view_layers[0]; fs = vl.freestyle_settings
    fs.crease_angle = math.radians(140)
    for ls in list(fs.linesets): fs.linesets.remove(ls)
    def lineset(name, coll, neg, vis, color, thick, dashed=False):
        ls = fs.linesets.new(name)
        ls.select_by_visibility = True; ls.visibility = vis
        ls.select_by_edge_types = True
        ls.select_silhouette = ls.select_border = ls.select_crease = True
        ls.select_external_contour = True
        ls.select_by_collection = True; ls.collection = coll
        ls.collection_negation = 'EXCLUSIVE' if neg else 'INCLUSIVE'
        st = ls.linestyle; st.color = color; st.thickness = thick; st.caps = 'ROUND'; st.chaining = 'PLAIN'
        if dashed:
            st.use_dashed_line = True; st.dash1 = 7; st.gap1 = 6
        return ls
    k = RES / 1440
    lineset('vis', ACC, True, 'VISIBLE', (0, 0, 0), 3.4 * k)
    lineset('acc', ACC, False, 'VISIBLE', (1, 0, 0), 4.0 * k)
    if hidden:
        lineset('hid', ACC, True, 'HIDDEN', (.55, .55, .55), 1.5 * k, dashed=True)
        lineset('hidacc', ACC, False, 'HIDDEN', (1, .45, .45), 1.6 * k, dashed=True)
    cd = bpy.data.cameras.new('cam')
    if ortho:
        cd.type = 'ORTHO'; cd.ortho_scale = ortho
    else:
        cd.lens = lens
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    tgt = bpy.data.objects.new('tgt', None); sc.collection.objects.link(tgt); tgt.location = target
    c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    rig = bpy.data.objects.new('rig', None); sc.collection.objects.link(rig); rig.location = target
    cam.location = Vector(cam_loc); parent([cam], rig)
    return rig

def shot(name):
    sh = sc.display.shading
    sc.render.use_freestyle = True
    sh.light = 'FLAT'; sh.color_type = 'MATERIAL'
    sc.render.filepath = os.path.join(OUT, f'{name}_l.png'); bpy.ops.render.render(write_still=True)
    sc.render.use_freestyle = False
    sh.light = 'STUDIO'; sh.color_type = 'SINGLE'; sh.single_color = (1, 1, 1)
    sh.studio_light = 'paint.sl' if 'paint.sl' in [s.name for s in bpy.context.preferences.studio_lights] else sh.studio_light
    sc.render.filepath = os.path.join(OUT, f'{name}_s.png'); bpy.ops.render.render(write_still=True)

ease = lambda t: t * t * (3 - 2 * t)
def seg(t, a, b):
    return ease(min(1, max(0, (t - a) / (b - a))))


if SCENE == 'hero':
    _, out_r, _ = sensor_box((-3.2, 0, 1.5))
    piv, _ = sct((6.6, -1.0, -4.6))
    tube([Vector(out_r) + Vector((0.2, 0, 0)), (9.8, 0.9, 1.2), (10.4, 0.6, -6.0), (7.6, -0.6, -7.4), (6.6, -1.0, -4.85)], 0.17)
    rig = setup((0, -30, 9), (2.6, 0, 3.6), ortho=26.5)
    for f in range(FRAMES):
        t = f / max(1, FRAMES - 1)
        rig.rotation_euler.z = math.radians(-26 + 52 * t)
        shot(f'{f:03d}')
elif SCENE == 'clamp':
    piv, (wx, wy, wz) = sct((0, 0, 0))
    tube([(0, 0, -0.4), (0.2, 0.3, -2.2), (-0.6, 0.8, -4.0)], 0.17)
    wire = cyl(0.5, 9, (wx, wy, wz), rot=(math.pi / 2, 0, 0), verts=48, accent=True)
    core = cyl(0.28, 9.6, (wx, wy, wz), rot=(math.pi / 2, 0, 0), verts=32, accent=True)
    rig = setup((-4, -26, 6), (-0.8, 0, 3.0), ortho=11.5)
    for f in range(FRAMES):
        t = f / max(1, FRAMES - 1)
        open_a = seg(t, 0.0, 0.3) * (1 - seg(t, 0.68, 0.95))
        piv.rotation_euler.y = math.radians(68) * open_a
        k = seg(t, 0.28, 0.66)
        for o in (wire, core):
            o.location = (wx - (1 - k) * 3.4, wy, wz + (1 - k) * 2.6)
        shot(f'{f:03d}')
elif SCENE == 'sensor':
    sensor_box((0, 0, 0))
    setup((-14, -26, 12), (0, 0, 4.4), ortho=13.5, hidden=False); shot('000')
elif SCENE == 'sct':
    sct((0, 0, 0))
    tube([(0, 0, -0.4), (0.3, 0.3, -2.4), (-0.9, 0.7, -4.0), (-2.4, 0.4, -4.4)], 0.17)
    setup((-7, -26, 8), (0, 0, 1.8), ortho=9.0, hidden=False); shot('000')
elif SCENE == 'fonte':
    fonte((0, 0, 0))
    setup((22, -15, 9), (-0.9, 0.6, -2.0), ortho=14.5, hidden=False); shot('000')
elif SCENE == 'fita':
    fita((0, 0, 0))
    setup((-10, -22, 16), (0.5, 0, 0.4), ortho=5.6, hidden=False); shot('000')
elif SCENE == 'verso':
    # costas do sensor com a fita colada e o protetor descolando
    root, _, _ = sensor_box((0, 0, 0))
    tape = fita((0, 0, 0))
    holder = bpy.data.objects.new('tape', None); sc.collection.objects.link(holder)
    parent(tape, holder)
    holder.rotation_euler = (-math.pi / 2, 0, 0); holder.scale = (1.55, 1.55, 1.0)
    holder.location = (0, 1.75, 3.0)
    setup((22, 18, 9), (0, 1.0, 4.8), ortho=14.5, hidden=False); shot('000')
