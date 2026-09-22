/**
 * Fábrica em tela cheia, atrás do texto: um setor para cada máquina.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const stage = document.querySelector('[data-fabrica-stage]');
const canvas = document.querySelector('[data-fabrica-canvas]');
const statusEl = document.querySelector('[data-fabrica-status]');

if (stage && canvas) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TILE = 3;
    const INJ_X = -2.2;
    const TANK_X = 9.6;
    const FILA_Z = [3.2, -1.6, -6.4];
    const X_MIN = -7.5;
    const X_MAX = 13.5;
    const Z_MIN = -10.5;
    const Z_MAX = 7.5;

    function fail(error) {
        console.error(error);
        stage.classList.add('is-error');
        if (!statusEl) return;
        const lang = (document.documentElement.lang || 'pt').slice(0, 2);
        statusEl.textContent = lang === 'en'
            ? 'Could not load the factory model.'
            : lang === 'es'
                ? 'No se pudo cargar la maqueta.'
                : 'Não foi possível carregar a maquete.';
    }

    function mark(object, { cast = true, doubleSide = false } = {}) {
        object.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = cast;
            child.receiveShadow = true;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
                if (!material) return;
                if (doubleSide) material.side = THREE.DoubleSide;
                material.envMapIntensity = 0.4;
            });
        });
    }

    function place(object, x, z) {
        object.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.x += x - center.x;
        object.position.z += z - center.z;
        object.position.y += 0.04 - box.min.y;
    }

    function addClone(source, x, y, z, rotY) {
        const clone = source.clone(true);
        clone.position.set(x, y, z);
        clone.rotation.y = rotY;
        return clone;
    }

    try {
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        const shadows = window.innerWidth >= 900;
        renderer.shadowMap.enabled = shadows;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();

        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 160);

        scene.add(new THREE.HemisphereLight(0xf4f7fb, 0xaeb6be, 1.15));

        const sun = new THREE.DirectionalLight(0xffffff, 1.75);
        sun.position.set(12, 24, 16);
        sun.castShadow = shadows;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.near = 2;
        sun.shadow.camera.far = 70;
        sun.shadow.camera.left = -28;
        sun.shadow.camera.right = 28;
        sun.shadow.camera.top = 22;
        sun.shadow.camera.bottom = -22;
        sun.shadow.bias = -0.0008;
        sun.shadow.normalBias = 0.04;
        scene.add(sun);

        const fill = new THREE.DirectionalLight(0xdbe7f2, 0.5);
        fill.position.set(-8, 8, 10);
        scene.add(fill);

        const factory = new THREE.Group();
        scene.add(factory);

                const labelRenderer = new CSS2DRenderer();
        labelRenderer.domElement.className = 'fabrica-labels';
        stage.appendChild(labelRenderer.domElement);
        const mobileSlot = document.createElement('div');
        mobileSlot.className = 'maq-mobile-slot';
        stage.appendChild(mobileSlot);
        const mobileCards = window.matchMedia('(max-width: 900px)');
        const machineLabels = [];

        const MACHINE_SPECS = [
            {
                name: 'INJETORA 6',
                alerts: 3,
                time: '1h 08min 22s',
                oee: 96.2,
                d: 98.0,
                p: 104.6,
                q: 99.4,
                kpis: ['128.4', '18.6', '1.246'],
                sku: '0142',
                product: 'TAMPA ROSCA 28 mm PP CRISTAL',
                detail: 'TAMPA ROSCA 28 mm PP CRISTAL / INJECAO'
            },
            {
                name: 'INJETORA 7',
                alerts: 4,
                time: '2h 41min 09s',
                oee: 91.8,
                d: 97.5,
                p: 112.3,
                q: 98.1,
                kpis: ['96.2', '22.8', '0.874'],
                sku: '0318',
                product: 'BALDE 5 L PEAD BRANCO',
                detail: 'BALDE 5 L PEAD BRANCO / INJECAO'
            },
            {
                name: 'INJETORA 8',
                alerts: 5,
                time: '2h 1min 34s',
                oee: 100.0,
                d: 100.0,
                p: 169.4,
                q: 100.0,
                kpis: ['169.8', '169.2', '2.934'],
                sku: '0261',
                product: 'JOELHO 90° ESG 75 mm PEVESUL',
                detail: 'JOELHO 90° ESG 75 mm PEVESUL / INJECAO'
            }
        ];

        function ringStyle(percent, radius) {
            const length = 2 * Math.PI * radius;
            const clamped = Math.max(0, Math.min(100, percent));
            return `stroke-dasharray:${length.toFixed(2)};stroke-dashoffset:${(length * (1 - clamped / 100)).toFixed(2)}`;
        }

        function machinePanel(spec) {
            const el = document.createElement('div');
            el.className = 'maq-anchor';
            const person = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="#8aa4c2"/><path d="M5.2 19.2c1.3-3.4 3.6-5 6.8-5s5.5 1.6 6.8 5" fill="#8aa4c2"/></svg>';
            el.innerHTML = `
                <div class="maq-chip">
                    <span class="maq-chip-pct">${spec.oee.toFixed(1)}%</span>
                    <span class="maq-chip-copy">
                        <span class="maq-chip-name">${spec.name}</span>
                        <span class="maq-running"><i></i>RODANDO</span>
                    </span>
                </div>
                <article class="maq-card maq-card--float">
                    <div class="maq-card-head">
                        <div class="maq-card-head-tools">
                            <span class="maq-ico">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="1.5"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                                <span class="maq-badge">${spec.alerts}</span>
                            </span>
                        </div>
                        <h2 class="maq-card-title">${spec.name}</h2>
                        <span class="maq-ico maq-ico--search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>
                        </span>
                    </div>
                    <div class="maq-card-body">
                        <div class="maq-card-main">
                            <div class="maq-status">
                                <p class="maq-time">${spec.time}</p>
                                <span class="maq-running"><i></i>RODANDO</span>
                                <div class="maq-users">
                                    <span class="maq-user">${person}</span>
                                    <span class="maq-user">${person}</span>
                                </div>
                            </div>
                            <div class="maq-oee">
                                <span class="maq-oee-label">OEE</span>
                                <div class="maq-oee-chart">
                                    <svg viewBox="0 0 120 120" aria-hidden="true">
                                        <circle class="maq-ring-track" cx="60" cy="60" r="46"></circle>
                                        <circle class="maq-ring-value is-ok" cx="60" cy="60" r="46" style="${ringStyle(spec.oee, 46)}"></circle>
                                    </svg>
                                    <strong>${spec.oee.toFixed(1)}</strong>
                                </div>
                            </div>
                            <div class="maq-dpq">
                                ${['D', 'P', 'Q'].map((letter, index) => {
                                    const value = [spec.d, spec.p, spec.q][index];
                                    return `<div class="maq-dpq-row">
                                        <svg viewBox="0 0 36 36" aria-hidden="true">
                                            <circle class="maq-ring-track" cx="18" cy="18" r="14"></circle>
                                            <circle class="maq-ring-value is-ok" cx="18" cy="18" r="14" style="${ringStyle(value, 14)}"></circle>
                                            <text x="18" y="22">${letter}</text>
                                        </svg>
                                        <span class="maq-dpq-pill">${value.toFixed(1)}%</span>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                        <div class="maq-card-foot">
                            <div class="maq-kpi"><strong>${spec.kpis[0]}</strong></div>
                            <div class="maq-kpi"><strong>${spec.kpis[1]}</strong></div>
                            <div class="maq-kpi maq-kpi--prod"><strong>${spec.kpis[2]}</strong></div>
                        </div>
                        <div class="maq-prod">
                            <strong>${spec.sku} ${spec.product}</strong>
                            <span>${spec.detail}</span>
                        </div>
                    </div>
                    <div class="maq-card-bar"></div>
                </article>`;
            return el;
        }

        const TANK_SPECS = [
            { name: 'TANQUE 1', kg: '1.842', material: 'PP CRISTAL', time: '1h 08min 22s' },
            { name: 'TANQUE 2', kg: '2.416', material: 'PEAD BRANCO', time: '2h 41min 09s' },
            { name: 'TANQUE 3', kg: '3.105', material: 'PEVESUL', time: '2h 01min 34s' }
        ];

        function tankPanel(spec) {
            const el = document.createElement('div');
            el.className = 'maq-anchor';
            el.innerHTML = `
                <div class="maq-chip">
                    <span class="maq-chip-pct">${spec.kg} kg</span>
                    <span class="maq-chip-copy">
                        <span class="maq-chip-name">${spec.name}</span>
                        <span class="maq-running"><i></i>RODANDO</span>
                    </span>
                </div>
                <article class="maq-card maq-card--float maq-card--tank">
                    <div class="maq-card-head">
                        <h2 class="maq-card-title">${spec.name}</h2>
                    </div>
                    <div class="maq-card-body">
                        <div class="maq-status">
                            <p class="maq-time">${spec.time}</p>
                            <span class="maq-running"><i></i>RODANDO</span>
                        </div>
                        <div class="maq-kg">
                            <span>Kg produzidos</span>
                            <strong>${spec.kg}</strong>
                            <em>kg</em>
                        </div>
                        <div class="maq-prod">
                            <strong>${spec.material}</strong>
                            <span>Material em processo</span>
                        </div>
                    </div>
                    <div class="maq-card-bar"></div>
                </article>`;
            return el;
        }

        const loader = new GLTFLoader();
        const files = [
            'piso-epoxi-3x3.glb',
            'parede-simples.glb',
            'parede-eletrica.glb',
            'parede-extintor.glb',
            'parede-luminaria.glb',
            'injetora-detalhada.glb',
            'tanque-cinza-detalhado.glb',
            'operador-animado.glb'
        ];

        Promise.all(files.map((name) => loader.loadAsync('glbimagens/' + name)))
            .then(([piso, simples, eletrica, extintor, luminaria, injetora, tanque, operador]) => {
                let tileIndex = 0;
                for (let x = X_MIN + TILE / 2; x < X_MAX; x += TILE) {
                    for (let z = Z_MIN + TILE / 2; z < Z_MAX; z += TILE) {
                        const tile = addClone(piso.scene, x, 0, z, 0);
                        const shift = ((tileIndex * 5) % 7) * 0.015 - 0.03;
                        tileIndex += 1;
                        tile.traverse((child) => {
                            if (!child.isMesh) return;
                            child.castShadow = false;
                            child.receiveShadow = true;
                            const source = Array.isArray(child.material) ? child.material : [child.material];
                            const tuned = source.map((material) => {
                                if (!material) return material;
                                const next = material.clone();
                                const epoxy = (material.name || '').indexOf('Epoxi') !== -1;
                                if (epoxy) {
                                    next.color.setRGB(0.42 + shift, 0.46 + shift * 0.7, 0.48 + shift * 0.45);
                                    next.roughness = 0.38;
                                    next.metalness = 0.04;
                                    if ('clearcoat' in next) {
                                        next.clearcoat = 0.22;
                                        next.clearcoatRoughness = 0.55;
                                    }
                                    next.envMapIntensity = 0.18;
                                } else {
                                    next.color.multiplyScalar(0.92);
                                    next.envMapIntensity = 0.12;
                                }
                                return next;
                            });
                            child.material = Array.isArray(child.material) ? tuned : tuned[0];
                        });
                        factory.add(tile);
                    }
                }

                const backTypes = [eletrica, luminaria, simples, extintor];
                let wallIndex = 0;
                for (let x = X_MIN + TILE / 2; x < X_MAX; x += TILE) {
                    const piece = addClone(backTypes[wallIndex % backTypes.length].scene, x, 0, Z_MIN, 0);
                    mark(piece, { doubleSide: true });
                    factory.add(piece);
                    wallIndex += 1;
                }

                for (let z = Z_MIN + TILE / 2; z < Z_MAX; z += TILE) {
                    const left = addClone(simples.scene, X_MIN, 0, z, Math.PI / 2);
                    const right = addClone(simples.scene, X_MAX, 0, z, -Math.PI / 2);
                    mark(left, { doubleSide: true });
                    mark(right, { doubleSide: true });
                    factory.add(left, right);
                }

                const paintCanvas = document.createElement('canvas');
                paintCanvas.width = 256;
                paintCanvas.height = 64;
                const paintCtx = paintCanvas.getContext('2d');
                paintCtx.fillStyle = '#e6b423';
                paintCtx.fillRect(0, 0, 256, 64);
                const edge = paintCtx.createLinearGradient(0, 0, 0, 64);
                edge.addColorStop(0, 'rgba(92, 58, 8, 0.55)');
                edge.addColorStop(0.16, 'rgba(255, 214, 90, 0.2)');
                edge.addColorStop(0.5, 'rgba(255, 236, 170, 0.08)');
                edge.addColorStop(0.84, 'rgba(255, 214, 90, 0.2)');
                edge.addColorStop(1, 'rgba(92, 58, 8, 0.55)');
                paintCtx.fillStyle = edge;
                paintCtx.fillRect(0, 0, 256, 64);
                for (let i = 0; i < 220; i += 1) {
                    const speck = Math.random() > 0.55 ? 'rgba(255,255,255,0.14)' : 'rgba(70,42,0,0.16)';
                    paintCtx.fillStyle = speck;
                    paintCtx.fillRect(Math.random() * 256, Math.random() * 64, 2 + Math.random() * 3, 1);
                }
                const paintTex = new THREE.CanvasTexture(paintCanvas);
                paintTex.colorSpace = THREE.SRGBColorSpace;
                paintTex.wrapS = THREE.RepeatWrapping;
                paintTex.wrapT = THREE.ClampToEdgeWrapping;
                paintTex.anisotropy = 8;

                const lineMat = {
                    yellow: new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        map: paintTex,
                        polygonOffset: true,
                        polygonOffsetFactor: -2,
                        polygonOffsetUnits: -2
                    }),
                    white: new THREE.MeshBasicMaterial({
                        color: 0xd5dee8,
                        polygonOffset: true,
                        polygonOffsetFactor: -2,
                        polygonOffsetUnits: -2
                    })
                };

                function addFloorLine(x, z, width, depth, material, y = 0.055) {
                    const line = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
                    line.rotation.x = -Math.PI / 2;
                    line.position.set(x, y, z);
                    factory.add(line);
                }

                const jointMat = new THREE.MeshBasicMaterial({
                    color: 0x6e787e,
                    polygonOffset: true,
                    polygonOffsetFactor: 1,
                    polygonOffsetUnits: 1
                });
                const midX = (X_MIN + X_MAX) / 2;
                const midZ = (Z_MIN + Z_MAX) / 2;
                for (let x = X_MIN + TILE; x < X_MAX - 0.01; x += TILE) {
                    addFloorLine(x, midZ, 0.035, Z_MAX - Z_MIN, jointMat, 0.046);
                }
                for (let z = Z_MIN + TILE; z < Z_MAX - 0.01; z += TILE) {
                    addFloorLine(midX, z, X_MAX - X_MIN, 0.035, jointMat, 0.046);
                }

                const aisleZ = 6.15;
                const aisleX = (X_MIN + X_MAX) / 2;
                const gapX = (INJ_X + 3.15 + TANK_X - 1.55) / 2;
                const stripe = 0.11;
                const frontHalf = 0.7;
                const vertHalf = 1.02;

                function addPaint(x, z, length, alongZ) {
                    const map = paintTex.clone();
                    map.needsUpdate = true;
                    map.repeat.set(Math.max(length / 0.62, 1), 1);
                    const material = lineMat.yellow.clone();
                    material.map = map;
                    const geometry = new THREE.PlaneGeometry(length, stripe);
                    if (alongZ) geometry.rotateZ(Math.PI / 2);
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.position.set(x, 0.058, z);
                    factory.add(mesh);
                }

                const frontLen = X_MAX - X_MIN - 1.5;
                addPaint(aisleX, aisleZ + frontHalf, frontLen, false);

                const innerZ = aisleZ - frontHalf;
                const leftEnd = gapX - vertHalf;
                const rightStart = gapX + vertHalf;
                const sideInset = 0.75;
                const leftLen = leftEnd - (X_MIN + sideInset);
                const rightLen = (X_MAX - sideInset) - rightStart;
                addPaint((X_MIN + sideInset + leftEnd) / 2, innerZ, leftLen, false);
                addPaint((rightStart + X_MAX - sideInset) / 2, innerZ, rightLen, false);

                const vertBottom = Z_MIN + 0.9;
                const vertLen = innerZ - vertBottom;
                const vertCenter = (vertBottom + innerZ) / 2;
                addPaint(gapX - vertHalf, vertCenter, vertLen, true);
                addPaint(gapX + vertHalf, vertCenter, vertLen, true);

                const mixer = new THREE.AnimationMixer(factory);
                const cycle = THREE.AnimationClip.findByName(injetora.animations, 'Ciclo_Injecao');
                const operate = THREE.AnimationClip.findByName(operador.animations, 'Operar_Painel');

                const tankLabels = [];
                const operatorNames = ['Carlos', 'Fernanda', 'João'];

                function attachName(person, name) {
                    person.updateWorldMatrix(true, true);
                    const box = new THREE.Box3().setFromObject(person);
                    const el = document.createElement('div');
                    el.className = 'op-name-anchor';
                    el.innerHTML = `<span class="op-name">${name}</span>`;
                    const label = new CSS2DObject(el);
                    label.position.y = box.max.y - person.position.y + 0.22;
                    person.add(label);
                }

                FILA_Z.forEach((z, index) => {
                    const machine = injetora.scene.clone(true);
                    machine.rotation.y = -Math.PI / 2;
                    mark(machine);
                    factory.add(machine);
                    place(machine, INJ_X, z);

                    const panel = machinePanel(MACHINE_SPECS[index]);
                    const anchor = new THREE.Object3D();
                    anchor.position.set(INJ_X, 2.9, z);
                    anchor.add(new CSS2DObject(panel));
                    factory.add(anchor);
                    machineLabels.push({ el: panel });

                    if (cycle) {
                        const action = mixer.clipAction(cycle, machine);
                        action.play();
                        action.time = index * 2.4;
                    }

                    const silo = tanque.scene.clone(true);
                    mark(silo);
                    factory.add(silo);
                    place(silo, TANK_X, z);

                    const tank = tankPanel(TANK_SPECS[index]);
                    const tankAnchor = new THREE.Object3D();
                    tankAnchor.position.set(TANK_X, 5.35, z);
                    tankAnchor.add(new CSS2DObject(tank));
                    factory.add(tankAnchor);
                    tankLabels.push({ el: tank });

                    const worker = operador.scene.clone(true);
                    worker.rotation.y = Math.PI;
                    mark(worker);
                    factory.add(worker);
                    place(worker, INJ_X, z + 2.45);
                    attachName(worker, operatorNames[index]);
                    if (operate) {
                        const action = mixer.clipAction(operate, worker);
                        action.play();
                        action.time = index * 0.9;
                    }
                });
                machineLabels.push(...tankLabels);

                const walkers = [];
                const caminhar = THREE.AnimationClip.findByName(operador.animations, 'Caminhar');

                function spawnWalker(points, speed, phase, name) {
                    const person = operador.scene.clone(true);
                    mark(person);
                    factory.add(person);
                    person.updateWorldMatrix(true, true);
                    const box = new THREE.Box3().setFromObject(person);
                    person.userData.foot = 0.04 - box.min.y;
                    person.position.y = person.userData.foot;
                    attachName(person, name);
                    if (caminhar) {
                        const action = mixer.clipAction(caminhar, person);
                        action.play();
                        action.time = phase;
                    }
                    const seg = [];
                    let length = 0;
                    for (let i = 1; i < points.length; i += 1) {
                        const distance = points[i].distanceTo(points[i - 1]);
                        seg.push(distance);
                        length += distance;
                    }
                    walkers.push({
                        person,
                        points,
                        seg,
                        length,
                        speed,
                        dist: phase * speed
                    });
                }

                spawnWalker([
                    new THREE.Vector3(gapX, 0, -8.4),
                    new THREE.Vector3(gapX, 0, 5.15)
                ], 1.25, 0.2, 'Ana');
                spawnWalker([
                    new THREE.Vector3(X_MIN + 1.4, 0, aisleZ),
                    new THREE.Vector3(X_MAX - 1.4, 0, aisleZ)
                ], 1.35, 1.1, 'Ricardo');

                function updateWalkers(dt) {
                    walkers.forEach((walker) => {
                        walker.dist += walker.speed * dt;
                        const trip = walker.length;
                        let travel = walker.dist % (trip * 2);
                        const forward = travel <= trip;
                        if (!forward) travel = trip * 2 - travel;
                        let remain = travel;
                        let index = 0;
                        while (index < walker.seg.length - 1 && remain > walker.seg[index]) {
                            remain -= walker.seg[index];
                            index += 1;
                        }
                        const span = walker.seg[index] || 1;
                        const t = remain / span;
                        const from = walker.points[index];
                        const to = walker.points[index + 1];
                        walker.person.position.x = from.x + (to.x - from.x) * t;
                        walker.person.position.z = from.z + (to.z - from.z) * t;
                        walker.person.position.y = walker.person.userData.foot;
                        const dx = to.x - from.x;
                        const dz = to.z - from.z;
                        if (dx * dx + dz * dz > 0.0001) {
                            const facing = Math.atan2(dx, dz);
                            walker.person.rotation.y = forward ? facing : facing + Math.PI;
                        }
                    });
                }

                updateWalkers(0);
                if (reduceMotion) mixer.timeScale = 0;
                stage.classList.add('is-ready');

                const clock = new THREE.Clock();
                const band = stage.parentElement?.querySelector(':scope > .hero-conveyor-wrap');
                const strip = stage.parentElement?.querySelector(':scope > .hero-live-bar');
                let visible = true;
                const observer = new IntersectionObserver(([entry]) => {
                    visible = entry.isIntersecting;
                });
                observer.observe(stage);

                function closeTake(z) {
                    return {
                        pos: new THREE.Vector3(-4.4, 5.2, z + 6.8),
                        look: new THREE.Vector3(-3.4, 3.6, z + 0.3)
                    };
                }

                const takes = [
                    { pos: new THREE.Vector3(3.5, 11.2, 15.2), look: new THREE.Vector3(3.5, 1.1, -1.6), focus: -1 },
                    { ...closeTake(FILA_Z[0]), focus: 0 },
                    {
                        pos: new THREE.Vector3(TANK_X - 5.6, 8.4, FILA_Z[0] + 8.4),
                        look: new THREE.Vector3(TANK_X - 1.8, 5.6, FILA_Z[0] + 0.1),
                        focus: 3
                    }
                ];
                const shot = 5.2;
                const look = new THREE.Vector3();
                let elapsed = 0;

                function applyTake(index, blend) {
                    const from = takes[index];
                    const to = takes[(index + 1) % takes.length];
                    camera.position.lerpVectors(from.pos, to.pos, blend);
                    look.lerpVectors(from.look, to.look, blend);
                    camera.lookAt(look);
                }

                let sizedWidth = 0;
                let sizedHeight = 0;

                function resize() {
                    if (band) stage.style.bottom = band.offsetHeight + 'px';
                    if (strip) stage.style.top = (strip.offsetTop + strip.offsetHeight) + 'px';
                    const width = stage.clientWidth;
                    const height = stage.clientHeight;
                    if (!width || height < 32) return;
                    const sameWidth = Math.abs(width - sizedWidth) < 2;
                    const barShift = Math.abs(height - sizedHeight) < 140;
                    if (sizedWidth && sameWidth && barShift) return;
                    sizedWidth = width;
                    sizedHeight = height;
                    camera.aspect = width / height;
                    camera.fov = width / height > 1.15 ? 40 : 44;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height, false);
                    labelRenderer.setSize(width, height);
                }

                resize();
                applyTake(0, 0);
                window.addEventListener('resize', resize);
                if (typeof ResizeObserver !== 'undefined') {
                    const resizeObserver = new ResizeObserver(resize);
                    if (band) resizeObserver.observe(band);
                    if (strip) resizeObserver.observe(strip);
                }

                function tick() {
                    requestAnimationFrame(tick);
                    if (!visible || document.hidden) return;
                    const delta = Math.min(clock.getDelta(), 0.05);
                    if (!reduceMotion) {
                        mixer.update(delta);
                        updateWalkers(delta);
                        elapsed += delta;
                        const span = takes.length * shot;
                        const local = elapsed % span;
                        const index = Math.floor(local / shot);
                        const along = (local % shot) / shot;
                        const blend = along < 0.68 ? 0 : ((along - 0.68) / 0.32);
                        const eased = blend * blend * (3 - 2 * blend);
                        applyTake(index, eased);
                        const focus = eased < 0.12 ? takes[index].focus : -1;
                        machineLabels.forEach((item, i) => {
                            const open = focus === i;
                            item.el.classList.toggle('is-open', open);
                            item.el.classList.remove('is-dim');
                            const card = item.card || item.el.querySelector('.maq-card--float');
                            item.card = card;
                            if (!card) return;
                            if (mobileCards.matches && open) {
                                if (card.parentElement !== mobileSlot) mobileSlot.appendChild(card);
                            } else if (card.parentElement !== item.el) {
                                item.el.appendChild(card);
                            }
                        });
                    }
                    renderer.render(scene, camera);
                    labelRenderer.render(scene, camera);
                }

                tick();
            })
            .catch(fail);
    } catch (error) {
        fail(error);
    }
}
