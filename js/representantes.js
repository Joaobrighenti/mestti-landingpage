(() => {
    const gallery = document.querySelector('.reps-gallery');
    const screens = Array.from(gallery.querySelectorAll('[data-screen-name]'));
    const tabs = document.createElement('div');
    tabs.className = 'reps-gallery-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Escolher tela da Mestti');
    const horizontalTabs = matchMedia('(max-width: 700px)');
    const setTabOrientation = () => tabs.setAttribute('aria-orientation', horizontalTabs.matches ? 'horizontal' : 'vertical');
    horizontalTabs.addEventListener('change', setTabOrientation);
    setTabOrientation();
    gallery.prepend(tabs);

    const items = screens.map((screen, index) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.id = 'reps-tab-' + index;
        tab.textContent = screen.dataset.screenName;
        tab.setAttribute('role', 'tab');

        const panel = document.createElement('div');
        panel.id = 'reps-panel-' + index;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        tab.setAttribute('aria-controls', panel.id);
        screen.replaceWith(panel);
        panel.append(screen);
        tabs.append(tab);

        tab.addEventListener('click', () => selectScreen(index));
        return { tab, panel };
    });

    function selectScreen(selected) {
        tabs.style.setProperty('--selected-tab', selected);
        items.forEach(({ tab, panel }, index) => {
            const active = selected === index;
            tab.tabIndex = active ? 0 : -1;
            tab.setAttribute('aria-selected', active);
            panel.hidden = !active;
        });
    }

    tabs.addEventListener('keydown', event => {
        const index = items.findIndex(({ tab }) => tab === event.target);
        if (index < 0) return;
        let next;
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                if (event.key !== (horizontalTabs.matches ? 'ArrowRight' : 'ArrowDown')) return;
                next = (index + 1) % items.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                if (event.key !== (horizontalTabs.matches ? 'ArrowLeft' : 'ArrowUp')) return;
                next = (index + items.length - 1) % items.length;
                break;
            case 'Home': next = 0; break;
            case 'End': next = items.length - 1; break;
            default: return;
        }
        event.preventDefault();
        selectScreen(next);
        items[next].tab.focus();
    });

    selectScreen(Math.max(0, screens.findIndex(screen => screen.dataset.screenName === 'Monitoramento')));
    gallery.dataset.galleryReady = '';

    const guide = document.querySelector('[data-install-guide]');
    const visual = guide.querySelector('.reps-install-visual');
    const stage = guide.querySelector('.reps-install-stage');
    const dialNav = guide.querySelector('.reps-install-dial');
    const dial = Array.from(dialNav.querySelectorAll('a'));
    const chapterNav = document.querySelector('.reps-index');
    const progressBar = chapterNav.querySelector('.reps-reading-progress');
    const chapters = Array.from(chapterNav.querySelectorAll('a')).map(link => ({
        link,
        target: document.getElementById(link.hash.slice(1))
    }));
    const steps = Array.from(guide.querySelectorAll('[data-install-step]'));
    const scenes = steps.map(step => step.querySelector('[data-install-scene]'));
    const kit = guide.querySelector('.reps-install-kit');
    const kitFallback = guide.querySelector('[data-kit-fallback]');
    function setKitAvailable(available) {
        // O próximo quadro precisa carregar mesmo enquanto a imagem está oculta.
        if (!available) kit.loading = 'eager';
        kit.hidden = !available;
        kitFallback.hidden = available;
    }
    kit.addEventListener('error', () => setKitAvailable(false));
    kit.addEventListener('load', () => setKitAvailable(true));
    if (kit.complete && !kit.naturalWidth) setKitAvailable(false);
    const desktopMotion = matchMedia('(min-width: 850px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)');
    const originalKit = kit.getAttribute('src');
    const frames = Array.from({ length: 12 }, (_, index) => String(index * 3).padStart(3, '0'));
    const loadedFrames = new Map();
    const clamp = value => Math.max(0, Math.min(1, value));
    let current = -1;
    let chapter;
    let requested = false;
    let scheduled = false;

    function loadRotation() {
        if (requested || navigator.connection?.saveData) return;
        requested = true;
        for (const frame of frames) {
            const image = new Image();
            image.onload = () => {
                loadedFrames.set(frame, image.src);
                schedule();
            };
            image.src = originalKit.replace(/\d{3}\.webp$/, frame + '.webp');
        }
    }

    function update() {
        scheduled = false;
        const height = window.innerHeight;
        const chapterLine = chapterNav.getBoundingClientRect().bottom + 24;
        const nextChapter = chapters.findLast(({ target }) => target.getBoundingClientRect().top <= chapterLine);
        const end = document.documentElement.scrollHeight - height;
        const readingProgress = end > 0 ? clamp(window.scrollY / end) : 0;
        progressBar.style.setProperty('--reading-progress', readingProgress);
        if (nextChapter !== chapter) {
            chapter?.link.removeAttribute('aria-current');
            nextChapter?.link.setAttribute('aria-current', 'location');
            chapter = nextChapter;
        }
        const bounds = guide.getBoundingClientRect();
        if (bounds.top > height + 280 || bounds.bottom < 0) return;

        const line = desktopMotion.matches
            ? Math.min(height * .48, chapterLine + 160)
            : chapterLine + dialNav.offsetHeight;
        const rects = steps.map(step => step.getBoundingClientRect());
        const active = Math.max(0, rects.findLastIndex(rect => rect.top <= line));

        if (current !== active) {
            steps[current]?.removeAttribute('aria-current');
            dial[current]?.removeAttribute('aria-current');
            scenes[current]?.removeAttribute('data-current');
            steps[active].setAttribute('aria-current', 'step');
            dial[active].setAttribute('aria-current', 'step');
            scenes[active].setAttribute('data-current', '');
            guide.dataset.active = steps[active].dataset.installStep;
            current = active;
        }

        if (!desktopMotion.matches) return;
        loadRotation();
        const progress = clamp((line - rects[0].top) / bounds.height);
        guide.style.setProperty('--install-progress', progress);
        if (active === 0) {
            const rotation = clamp((line - rects[0].top) / rects[0].height);
            const url = loadedFrames.get(frames[Math.round(rotation * (frames.length - 1))]);
            if (url && kit.src !== url) kit.src = url;
        }
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(update);
    }

    function adaptMotion() {
        guide.toggleAttribute('data-track', desktopMotion.matches);
        const dialContainer = desktopMotion.matches ? visual : guide;
        if (dialNav.parentElement !== dialContainer) {
            const focused = document.activeElement;
            dialContainer.prepend(dialNav);
            if (dial.includes(focused)) focused.focus({ preventScroll: true });
        }
        scenes.forEach((scene, index) => {
            (desktopMotion.matches ? stage : steps[index]).append(scene);
            scene.removeAttribute('data-current');
            steps[index].removeAttribute('aria-current');
            dial[index].removeAttribute('aria-current');
        });
        if (!desktopMotion.matches) kit.setAttribute('src', originalKit);
        delete guide.dataset.active;
        current = -1;
        if (desktopMotion.matches) {
            scenes[0].setAttribute('data-current', '');
        }
        schedule();
    }

    desktopMotion.addEventListener('change', adaptMotion);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule, { once: true });
    adaptMotion();
})();
