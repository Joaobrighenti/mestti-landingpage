/**
 * Otto, o polvo do Mestti OPS, vivo no site. Porte em JS puro de
 * mestti_frontend/src/features/consultoria/components/mascot/OpsMascotLive.tsx (main):
 * olhos seguem o mouse, piscam, e um clique faz o pulinho com olhos felizes e bolhas.
 * Uso: <svg data-otto-live data-size="160"></svg> (montado por js/v2.js).
 */
const MASCOT_PURPLE = '#7040FF';
const EYES = [{ x: 517, y: 555 }, { x: 737, y: 555 }];
const EYE_RX = 37;
const EYE_RY = 54;
const OUTLINE = [615.1,201.6,602,202.2,589,203.5,576.3,205.3,563.7,207.6,551.4,210.3,539.2,213.5,527.2,217.2,515.5,221.5,504,226.4,492.8,231.8,481.7,237.8,470.9,244.2,460.3,251.2,449.9,258.7,439.8,266.8,429.9,275.4,420.4,284.5,411.3,294.1,402.6,303.9,394.6,314.1,387.1,324.5,380.4,335.2,374.1,346.1,368.3,357.2,363.1,368.6,358.4,380.1,354.2,391.9,350.4,403.8,347.2,416,344.4,428.3,342.3,441,340.9,453.9,340.3,467,340.6,480.3,341.7,493.3,343.6,506,346.2,518.4,349.6,530.5,353.6,542.4,358.2,553.9,363.4,565.3,368.8,576.6,373.9,587.9,377.8,599.7,379.1,611.6,376.8,622.8,370.4,631.7,360.7,636.7,349.4,637.3,338.1,633.8,327.7,627.1,318.8,618.3,310.9,608.2,303.6,597.8,296,587.5,287.4,577.8,277.9,569.3,267.2,562.5,255.7,557.9,243.4,555.6,230.8,555.8,218.6,558.4,207.2,563.4,197,570.4,188.2,579.2,181.3,589.4,176.3,600.8,173.4,612.9,172.7,625.5,174,637.9,177.1,650.1,181.8,661.6,187.7,672.7,194.9,683.1,203.3,692.8,212.8,701.6,223,709.3,233.8,715.8,245,721.3,256.7,725.7,268.9,729,281.4,731.2,294.4,732.3,307.5,732.4,320.5,732.3,331.2,733.6,337,737.5,335.6,743.9,328.4,750.8,317.8,757,306.3,761.6,294.4,765.6,282.4,769.1,270.3,772.6,258.3,776.2,246.4,780.1,234.8,784.6,223.6,790.1,213.1,797.1,203.7,805.5,196,815.4,190.3,826.4,186.7,838.4,185.5,850.9,186.5,863.4,189.8,875.4,195.3,886.6,202.8,896.8,211.9,905.6,222.3,912.6,233.7,917.7,245.7,921.1,258.2,922.9,270.9,923.2,283.6,922.2,296.1,920,308.2,916.5,319.8,911.9,330.9,906.3,341.7,899.7,352.2,892.3,362.2,884.1,371.8,875.2,380.9,865.7,389.3,855.8,397.2,845.5,404.8,835.2,412.3,824.9,420.7,815.6,430.2,808.9,440.3,807.1,449.1,811,454.5,819.7,455.6,830.9,453,842.6,447.7,853.8,440.8,864.4,432.9,874.7,424.5,884.7,416.1,894.7,408,904.9,400.6,915.3,394,926.1,388.5,937.3,384.1,949,381.4,961.2,380.7,973.7,382.1,986.2,385.6,998.1,391.2,1009.3,398.7,1019.2,408,1027.5,418.6,1034.1,430.1,1038.8,442.4,1041.8,455.1,1042.9,467.9,1042.4,480.5,1040.4,492.6,1037,504.1,1032.2,515.1,1026.2,525.6,1019,535.4,1010.5,544.4,1001.1,552.2,990.9,559.1,980.3,565,969.2,570.3,957.9,574.9,946.3,579,934.5,582.8,922.6,586.2,910.5,589.3,898.3,592.3,886,595.8,873.9,600.4,862.4,607,852.3,615.9,845,626.4,842.1,637,844.2,646.1,850.9,652.9,860.7,657.8,872,661.4,884.1,664.4,896.3,667.3,908.6,670.5,920.8,674,932.8,677.9,944.7,682.1,956.5,686.9,968,692.5,979.2,699,990,706.6,1000.3,715.2,1009.9,724.8,1018.5,735.2,1025.9,746.2,1031.9,757.7,1036.6,769.8,1040.1,782.4,1042.2,795.2,1042.8,807.9,1041.9,820.2,1039.3,832,1035,842.8,1028.9,852.5,1021,860.5,1011.5,866.6,1000.6,870.6,988.8,872.6,976.4,872.3,963.7,869.9,951.4,865.7,939.6,860.3,928.4,853.8,917.6,846.5,907.1,838.6,896.8,830.4,886.7,822.1,876.7,814.2,866.5,807.1,855.9,801.5,844.7,798.3,833,798.6,821.5,803.4,812.1,811.8,807.2,821.8,808.1,831.4,814.2,839.8,823.3,847.6,833.5,855.2,843.8,863.2,854,871.6,864,880.5,873.7,889.9,882.9,899.8,891.4,910.1,899.1,920.9,905.8,932,911.4,943.6,916.1,955.6,919.6,968.1,921.9,980.9,922.8,993.7,922.3,1006.3,920.3,1018.3,916.8,1029.7,911.7,1040.2,904.8,1049.6,896.4,1057.4,886.5,1063.2,875.4,1066.8,863.6,1068,851.2,1066.8,838.9,1063.3,827,1057.6,815.9,1049.9,806,1040.6,797.5,1030.2,790.4,1019,784.7,1007.4,780.1,995.6,776.2,983.5,772.6,971.5,769.1,959.4,765.6,947.6,761.6,936,757,925.3,750.9,918,743.9,916.3,737.4,921.9,733.4,932.3,732.2,945.2,732.3,958.3,732.1,971.2,730.8,983.7,728.6,995.9,725.4,1007.7,721.1,1019,715.9,1029.9,709.5,1040.2,702.1,1049.9,693.6,1058.5,684.1,1065.9,673.8,1072,662.8,1076.7,651.2,1080,639.1,1081.6,626.5,1081.3,613.9,1078.7,601.6,1074.1,590,1067.3,579.6,1058.8,570.5,1048.6,563.4,1037.2,558.4,1025,555.8,1012.4,555.5,1000,557.5,988.3,561.8,977.6,568.1,967.9,576.2,959.4,585.7,951.8,595.9,944.6,606.4,936.8,616.5,928,625.5,917.8,632.5,906.5,636.7,895,637.2,884.8,633.3,877.4,625.3,874,614.6,874.5,602.7,877.9,590.9,882.9,579.4,888.4,568.2,893.7,556.9,898.5,545.4,902.8,533.7,906.4,521.7,909.3,509.4,911.3,496.7,912.4,483.7,912.8,470.4,912.4,457.1,911.3,444.1,909.4,431.4,906.8,419,903.6,406.8,899.9,394.8,895.9,383,891.4,371.4,886.3,359.9,880.7,348.8,874.5,337.9,867.8,327.1,860.6,316.6,852.9,306.3,844.5,296.3,835.6,286.7,826.2,277.6,816.4,268.9,806.3,260.6,796,252.9,785.5,245.8,774.7,239.2,763.7,233.1,752.5,227.5,741.1,222.6,729.3,218.3,717.4,214.5,705.3,211.2,693,208.4,680.4,206,667.7,204.1,654.8,202.7,641.6,201.9,628.4,201.4];
export const STATIC_PATH = 'M615 202 L589 204 L564 208 L539 214 L516 222 L493 232 L471 244 L450 259 L430 275 L411 294 L395 314 L380 335 L368 357 L358 380 L350 404 L344 428 L341 454 L341 480 L344 506 L350 530 L358 554 L369 577 L378 600 L377 623 L361 637 L338 634 L319 618 L304 598 L287 578 L267 562 L243 556 L219 558 L197 570 L181 589 L173 613 L174 638 L182 662 L195 683 L213 702 L234 716 L257 726 L281 731 L308 732 L331 734 L336 744 L318 757 L294 766 L270 773 L246 780 L224 790 L204 806 L190 826 L186 851 L190 875 L203 897 L222 913 L246 921 L271 923 L296 920 L320 912 L342 900 L362 884 L381 866 L397 846 L412 825 L430 809 L449 811 L456 831 L448 854 L433 875 L416 895 L401 915 L388 937 L381 961 L382 986 L391 1009 L408 1028 L430 1039 L455 1043 L480 1040 L504 1032 L526 1019 L544 1001 L559 980 L570 958 L579 934 L586 910 L592 886 L600 862 L616 845 L637 844 L653 861 L661 884 L667 909 L674 933 L682 956 L692 979 L707 1000 L725 1018 L746 1032 L770 1040 L795 1043 L820 1039 L843 1029 L860 1012 L871 989 L872 964 L866 940 L854 918 L839 897 L822 877 L807 856 L798 833 L803 812 L822 808 L840 823 L855 844 L872 864 L890 883 L910 899 L932 911 L956 920 L981 923 L1006 920 L1030 912 L1050 896 L1063 875 L1068 851 L1063 827 L1050 806 L1030 790 L1007 780 L984 773 L959 766 L936 757 L918 744 L922 733 L945 732 L971 731 L996 725 L1019 716 L1040 702 L1058 684 L1072 663 L1080 639 L1081 614 L1074 590 L1059 570 L1037 558 L1012 556 L988 562 L968 576 L952 596 L937 616 L918 632 L895 637 L877 625 L874 603 L883 579 L894 557 L903 534 L909 509 L912 484 L912 457 L909 431 L904 407 L896 383 L886 360 L874 338 L861 317 L844 296 L826 278 L806 261 L786 246 L764 233 L741 223 L717 214 L693 208 L668 204 L642 202 Z';

const C0 = { x: 627, y: 600 };
const SEG = 9;
const NV = OUTLINE.length / 2;
const LEFT_ARMS = [
    { base: [440, 650], ctrl: [330, 700], tip: [232, 604], phase: 0.0 },
    { base: [470, 760], ctrl: [340, 790], tip: [245, 856], phase: 1.7 },
    { base: [540, 800], ctrl: [490, 880], tip: [468, 968], phase: 3.1 }
];
const ARMS = [...LEFT_ARMS, ...LEFT_ARMS.map((a) => ({
    base: [1254 - a.base[0], a.base[1]], ctrl: [1254 - a.ctrl[0], a.ctrl[1]], tip: [1254 - a.tip[0], a.tip[1]], phase: a.phase + 0.9
}))];

const mul = (m, n) => ({ a: m.a * n.a + m.c * n.b, b: m.b * n.a + m.d * n.b, c: m.a * n.c + m.c * n.d, d: m.b * n.c + m.d * n.d });
const rot = (t) => ({ a: Math.cos(t), b: Math.sin(t), c: -Math.sin(t), d: Math.cos(t) });
const scl = (sx, sy = sx) => ({ a: sx, b: 0, c: 0, d: sy });
const stretch = (phi, p, q) => {
    const c = Math.cos(phi); const s = Math.sin(phi); const off = (p - q) * c * s;
    return { a: p * c * c + q * s * s, b: off, c: off, d: p * s * s + q * c * c };
};
const apply = (m, x, y) => [m.a * x + m.c * y, m.b * x + m.d * y];
const inv = (m) => { const det = m.a * m.d - m.b * m.c || 1e-6; return { a: m.d / det, b: -m.b / det, c: -m.c / det, d: m.a / det }; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const ARM_REST = ARMS.map((arm) => {
    const pts = [];
    for (let i = 0; i < SEG; i++) {
        const t = i / (SEG - 1); const u = 1 - t;
        pts.push([u * u * arm.base[0] + 2 * u * t * arm.ctrl[0] + t * t * arm.tip[0], u * u * arm.base[1] + 2 * u * t * arm.ctrl[1] + t * t * arm.tip[1]]);
    }
    const normals = pts.map((_, i) => {
        const a = pts[Math.max(0, i - 1)]; const b = pts[Math.min(SEG - 1, i + 1)];
        const dx = b[0] - a[0]; const dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1;
        return [-dy / l, dx / l];
    });
    const lens = pts.map((p, i) => (i === 0 ? 0 : Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])));
    return { pts, normals, lens };
});

const BIND = (() => {
    const NA = ARM_REST.length; const W = []; const J = []; const F = [];
    for (let v = 0; v < NV; v++) {
        const x = OUTLINE[v * 2]; const y = OUTLINE[v * 2 + 1];
        const rigid = smoothstep(292, 335, Math.hypot(x - 627, y - 470)) * smoothstep(150, 200, Math.hypot((x - 627) / 1.2, y - 690));
        const w = new Float64Array(NA); const js = new Int32Array(NA); const fs = new Float64Array(NA);
        let sum = 0;
        for (let a = 0; a < NA; a++) {
            const rest = ARM_REST[a];
            let best = { d: 1e9, j: 0, f: 0 };
            for (let j = 0; j < SEG - 1; j++) {
                const [ax, ay] = rest.pts[j]; const [bx, by] = rest.pts[j + 1];
                const dx = bx - ax; const dy = by - ay;
                const f = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
                const d = Math.hypot(ax + dx * f - x, ay + dy * f - y);
                if (d < best.d) best = { d, j, f };
            }
            js[a] = best.j; fs[a] = best.f;
            w[a] = 1 / Math.pow(best.d + 1, 4);
            sum += w[a];
            w[a] *= smoothstep(0.08, 0.5, (best.j + best.f) / (SEG - 1)) * smoothstep(230, 170, best.d);
        }
        for (let a = 0; a < NA; a++) w[a] = (w[a] / sum) * rigid;
        W.push(w); J.push(js); F.push(fs);
    }
    let cur = W;
    const kernel = [1, 2, 3, 2, 1].map((k) => k / 9);
    for (let pass = 0; pass < 3; pass++) {
        const next = [];
        for (let v = 0; v < NV; v++) {
            const out = new Float64Array(NA);
            for (let k = -2; k <= 2; k++) { const src = cur[(v + k + NV) % NV]; for (let a = 0; a < NA; a++) out[a] += src[a] * kernel[k + 2]; }
            next.push(out);
        }
        cur = next;
    }
    return cur.map((ws, v) => { const list = []; for (let a = 0; a < NA; a++) if (ws[a] > 0.002) list.push({ a, j: J[v][a], f: F[v][a], w: ws[a] }); return list; });
})();

const NEIGHBORS = [[0, 1], [1, 2], [2, 5], [5, 4], [4, 3]];
const BUBBLES = 10;
const NS = 'http://www.w3.org/2000/svg';
let uid = 0;

export function mountOtto(svg, { size = 160, color = MASCOT_PURPLE, onPoke } = {}) {
    const W = size; const H = size;
    const maskId = `otto-live-${++uid}`;
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('tabindex', '0');
    svg.setAttribute('role', 'img');
    svg.style.overflow = 'visible';
    svg.style.touchAction = 'manipulation';
    const eyes = EYES.map((e) => `<ellipse cx="${e.x}" cy="${e.y}" rx="${EYE_RX}" ry="${EYE_RY}" fill="black"/>`).join('');
    const happy = EYES.map((e) => `<path d="M${e.x - 38} ${e.y + 16} Q${e.x} ${e.y - 44} ${e.x + 38} ${e.y + 16}"/>`).join('');
    svg.innerHTML = `<defs><mask id="${maskId}" maskUnits="userSpaceOnUse" x="${-size}" y="${-size}" width="${size * 3}" height="${size * 3}">
        <rect x="${-size}" y="${-size}" width="${size * 3}" height="${size * 3}" fill="white"/>
        <g data-face>${eyes}<g data-happy opacity="0" fill="none" stroke="black" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">${happy}</g></g>
        </mask></defs>
        <g>${Array.from({ length: BUBBLES }, () => `<circle fill="none" stroke="${color}" stroke-width="0.9" opacity="0"/>`).join('')}</g>
        <path data-body fill="${color}" mask="url(#${maskId})"/>`;
    const body = svg.querySelector('[data-body]');
    const face = svg.querySelector('[data-face]');
    const eyeEls = [...face.querySelectorAll('ellipse')];
    const happyEl = svg.querySelector('[data-happy]');
    const bubbleEls = [...svg.querySelectorAll('circle')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = (W * 0.8) / 910;
    const home = { x: W / 2, y: H * 0.46 };
    const st = {
        p: { ...home }, v: { x: 0, y: 0 }, th: 0, thv: 0, q: 0, qv: 0, qn: Math.PI / 2, A: scl(S), time: 0,
        ptr: null, hover: false, look: [0, 0], lookV: [0, 0], blinkT: 1.5, blink: 0, happy: 0, excite: 0,
        arms: [], base: ARMS.map(() => new Float64Array(SEG * 2)),
        dx: new Float64Array(NV), dy: new Float64Array(NV), tx: new Float64Array(NV), ty: new Float64Array(NV),
        bubbles: Array.from({ length: BUBBLES }, () => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0, life: 0, max: 1, ph: 0 }))
    };
    const buildMatrix = () => {
        const speed = Math.hypot(st.v.x, st.v.y);
        const s = clamp(speed * (0.00006 * (112 / size)), 0, 0.12);
        const vel = stretch(Math.atan2(st.v.y, st.v.x), 1 + s, 1 / (1 + s));
        const imp = stretch(st.qn, 1 - st.q, 1 / (1 - st.q));
        const breath = reduced ? 0 : Math.sin(st.time * 2.1) * 0.014;
        return mul(mul(mul(vel, imp), mul(scl(1 - breath * 0.5, 1 + breath), rot(st.th))), scl(S));
    };
    const toWorld = (A, lx, ly) => { const [x, y] = apply(A, lx - C0.x, ly - C0.y); return [st.p.x + x, st.p.y + y]; };
    st.A = buildMatrix();
    st.arms = ARM_REST.map((rest) => rest.pts.map(([lx, ly]) => { const [x, y] = toWorld(st.A, lx, ly); return { x, y, px: x, py: y }; }));
    const localPtr = () => {
        if (!st.ptr) return null;
        const r = svg.getBoundingClientRect();
        return { x: ((st.ptr.x - r.left) / r.width) * W, y: ((st.ptr.y - r.top) / r.height) * H };
    };
    const pt = typeof DOMPoint !== 'undefined' ? new DOMPoint() : null;
    const inside = (p) => { if (!p || !pt) return false; pt.x = p.x; pt.y = p.y; try { return body.isPointInFill(pt); } catch { return false; } };
    const emitBubble = (x, y) => {
        const b = st.bubbles.find((bb) => bb.life <= 0);
        if (!b) return;
        Object.assign(b, { x, y, vx: (Math.random() - 0.5) * 30, vy: -40 - Math.random() * 40, r: 1.5 + Math.random() * 2.5, ph: Math.random() * 6.28 });
        b.life = b.max = 0.9 + Math.random() * 0.7;
    };
    const poke = () => {
        st.v.y -= H * 4.2; st.v.x += (Math.random() - 0.5) * W * 1.2;
        st.qn = Math.PI / 2; st.qv += 1.6; st.thv += (Math.random() < 0.5 ? -1 : 1) * 4;
        st.happy = 0.9; st.excite = 1;
        for (const arm of st.arms) for (let i = 2; i < SEG; i++) { arm[i].px -= (Math.random() - 0.5) * 6 * (i / SEG); arm[i].py -= (Math.random() - 0.2) * 6 * (i / SEG); }
        for (let i = 0; i < 5; i++) emitBubble(st.p.x + (Math.random() - 0.5) * W * 0.4, st.p.y - H * 0.2);
        if (onPoke) onPoke();
    };
    const DT = 1 / 120;
    const step = () => {
        st.time += DT;
        st.v.x += ((home.x - st.p.x) * 60 - st.v.x * 7) * DT;
        st.v.y += ((home.y - st.p.y) * 60 - st.v.y * 7) * DT;
        if (!reduced) st.v.y += Math.sin(st.time * 1.3) * H * 0.06 * DT * 6;
        st.p.x += st.v.x * DT; st.p.y += st.v.y * DT;
        const thT = clamp(st.v.x * 0.0025 * (112 / size), -0.3, 0.3) + clamp(st.look[0] * 0.003, -0.08, 0.08);
        st.thv += ((thT - st.th) * 95 - st.thv * 10) * DT; st.th += st.thv * DT;
        st.qv += (-st.q * 360 - st.qv * 11) * DT; st.q = clamp(st.q + st.qv * DT, -0.18, 0.2);
        st.A = buildMatrix();
        st.excite = Math.max(0, st.excite - DT * 1.2);
        for (let a = 0; a < st.arms.length; a++) {
            const arm = st.arms[a]; const rest = ARM_REST[a]; const phase = ARMS[a].phase;
            for (let i = 0; i < SEG; i++) {
                const t = i / (SEG - 1);
                const amp = reduced ? 0 : 16 + st.excite * 26;
                const speedW = 2.3 + st.excite * 6;
                const wave = Math.sin(st.time * speedW + phase + t * 2.6) * amp * t + Math.sin(st.time * 1.1 + phase * 2) * 6 * t;
                const [tx, ty] = toWorld(st.A, rest.pts[i][0] + rest.normals[i][0] * wave, rest.pts[i][1] + rest.normals[i][1] * wave);
                const [bx, by] = toWorld(st.A, rest.pts[i][0], rest.pts[i][1]);
                st.base[a][i * 2] = bx; st.base[a][i * 2 + 1] = by;
                const n = arm[i];
                if (i === 0) { n.px = n.x = tx; n.py = n.y = ty; continue; }
                const vx = (n.x - n.px) * 0.965; const vy = (n.y - n.py) * 0.965;
                n.px = n.x; n.py = n.y; n.x += vx; n.y += vy + 600 * S * DT * DT;
                const k = lerp(0.24, 0.05, Math.pow(t, 0.8));
                n.x += (tx - n.x) * k; n.y += (ty - n.y) * k;
                const maxDev = 115 * S * t; const ddx = n.x - tx; const ddy = n.y - ty; const dd = Math.hypot(ddx, ddy);
                if (dd > maxDev) { n.x = tx + (ddx / dd) * maxDev; n.y = ty + (ddy / dd) * maxDev; }
            }
            for (let it = 0; it < 3; it++) {
                for (let i = 1; i < SEG; i++) {
                    const p0 = arm[i - 1]; const p1 = arm[i];
                    const dx = p1.x - p0.x; const dy = p1.y - p0.y; const d = Math.hypot(dx, dy) || 1e-6;
                    const diff = (d - rest.lens[i] * S) / d;
                    if (i === 1) { p1.x -= dx * diff; p1.y -= dy * diff; } else { p0.x += dx * diff * 0.5; p0.y += dy * diff * 0.5; p1.x -= dx * diff * 0.5; p1.y -= dy * diff * 0.5; }
                }
            }
        }
        for (const [ia, ib] of NEIGHBORS) {
            const a1 = st.arms[ia]; const b1 = st.arms[ib]; const r1 = ARM_REST[ia].pts; const r2 = ARM_REST[ib].pts;
            for (let i = 2; i < SEG; i++) {
                const minD = Math.hypot(r1[i][0] - r2[i][0], r1[i][1] - r2[i][1]) * S * 0.7;
                const dx = b1[i].x - a1[i].x; const dy = b1[i].y - a1[i].y; const d = Math.hypot(dx, dy) || 1e-6;
                if (d < minD) { const push = ((minD - d) / d) * 0.5; a1[i].x -= dx * push; a1[i].y -= dy * push; b1[i].x += dx * push; b1[i].y += dy * push; }
            }
        }
        const lp = localPtr();
        let target = [0, 0];
        if (lp && !st.hover) {
            const [lx, ly] = apply(inv(st.A), lp.x - st.p.x, lp.y - st.p.y);
            const dx = lx + C0.x - 627; const dy = ly + C0.y - 555; const d = Math.hypot(dx, dy) || 1; const m = clamp(d / 320, 0, 1);
            target = [(dx / d) * m * 44, (dy / d) * m * 34];
        }
        for (let k = 0; k < 2; k++) { st.lookV[k] += ((target[k] - st.look[k]) * 480 - st.lookV[k] * 34) * DT; st.look[k] += st.lookV[k] * DT; }
        st.blinkT -= DT;
        if (st.blinkT <= 0) { st.blink = 0.14; st.blinkT = 2.4 + Math.random() * 3.4; if (Math.random() < 0.2) st.blinkT = 0.3; }
        st.blink = Math.max(0, st.blink - DT);
        st.happy = Math.max(0, st.happy - DT);
        for (const b of st.bubbles) { if (b.life <= 0) continue; b.life -= DT; b.x += (b.vx + Math.sin(st.time * 5 + b.ph) * 12) * DT; b.y += b.vy * DT; }
    };
    const render = () => {
        const A = st.A;
        const tx0 = st.p.x - (A.a * C0.x + A.c * C0.y); const ty0 = st.p.y - (A.b * C0.x + A.d * C0.y);
        face.setAttribute('transform', `matrix(${A.a},${A.b},${A.c},${A.d},${tx0},${ty0})`);
        const { dx: DX, dy: DY, tx: TX, ty: TY } = st;
        for (let v = 0; v < NV; v++) {
            let X = 0; let Y = 0;
            for (const { a: ai, j, f, w } of BIND[v]) {
                const arm = st.arms[ai]; const base = st.base[ai];
                X += lerp(arm[j].x - base[j * 2], arm[j + 1].x - base[j * 2 + 2], f) * w;
                Y += lerp(arm[j].y - base[j * 2 + 1], arm[j + 1].y - base[j * 2 + 3], f) * w;
            }
            DX[v] = X; DY[v] = Y;
        }
        for (let pass = 0; pass < 6; pass++) {
            for (let v = 0; v < NV; v++) { const p = (v + NV - 1) % NV; const n = (v + 1) % NV; TX[v] = (DX[p] + 2 * DX[v] + DX[n]) * 0.25; TY[v] = (DY[p] + 2 * DY[v] + DY[n]) * 0.25; }
            DX.set(TX); DY.set(TY);
        }
        let d = '';
        for (let v = 0; v < NV; v++) {
            const [rx, ry] = apply(A, OUTLINE[v * 2] - C0.x, OUTLINE[v * 2 + 1] - C0.y);
            d += `${v === 0 ? 'M' : 'L'}${(st.p.x + rx + DX[v]).toFixed(2)},${(st.p.y + ry + DY[v]).toFixed(2)}`;
        }
        body.setAttribute('d', `${d}Z`);
        const isHappy = st.happy > 0;
        const blinkK = st.blink > 0 ? Math.abs(Math.sin((st.blink / 0.14) * Math.PI)) : 0;
        const open = Math.max(0.08, 1 - blinkK * 0.95);
        const turn = st.look[0] / 44;
        eyeEls.forEach((el, k) => {
            const side = k === 0 ? -1 : 1;
            const persp = 1 - Math.max(0, turn * side) * 0.12 + Math.max(0, -turn * side) * 0.04;
            el.setAttribute('cx', EYES[k].x + st.look[0] + turn * 4 * -side);
            el.setAttribute('cy', EYES[k].y + st.look[1]);
            el.setAttribute('rx', EYE_RX * persp);
            el.setAttribute('ry', EYE_RY * open);
            el.setAttribute('opacity', isHappy ? '0' : '1');
        });
        happyEl.setAttribute('opacity', isHappy ? '1' : '0');
        st.bubbles.forEach((b, i) => {
            const el = bubbleEls[i];
            if (b.life <= 0) { el.setAttribute('opacity', '0'); return; }
            const k = b.life / b.max;
            el.setAttribute('cx', b.x.toFixed(2)); el.setAttribute('cy', b.y.toFixed(2));
            el.setAttribute('r', (b.r * (0.6 + 0.4 * (1 - k))).toFixed(2));
            el.setAttribute('opacity', String(Math.min(1, k * 2) * 0.55));
        });
        st.hover = inside(localPtr());
        svg.style.cursor = st.hover ? 'pointer' : 'default';
    };
    window.addEventListener('pointermove', (ev) => { st.ptr = { x: ev.clientX, y: ev.clientY }; }, { passive: true });
    window.addEventListener('pointerout', (ev) => { if (!ev.relatedTarget) st.ptr = null; });
    svg.addEventListener('pointerdown', (ev) => { st.ptr = { x: ev.clientX, y: ev.clientY }; if (inside(localPtr())) poke(); });
    svg.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); poke(); } });
    let visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(svg);
    let last = performance.now(); let acc = 0;
    const loop = (now) => {
        requestAnimationFrame(loop);
        if (!visible || document.hidden) { last = now; return; }
        acc += Math.min(0.05, (now - last) / 1000); last = now;
        while (acc >= DT) { step(); acc -= DT; }
        render();
    };
    requestAnimationFrame(loop);
    return { poke };
}
