/**
 * Hero background video — compatível com Safari/iOS
 */
(function () {
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function shouldSkip() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
        const conn = navigator.connection;
        if (conn && (conn.saveData || /(^2g|slow-2g)/.test(conn.effectiveType || ''))) return true;
        return false;
    }

    function prepareVideo(video) {
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
    }

    function assignSrc(video, baseSrc) {
        const clean = baseSrc.replace(/#.*$/, '');
        const next = isIOS() ? `${clean}#t=0.001` : clean;
        const current = video.getAttribute('src') || '';
        if (!current || current.split('#')[0] !== clean) {
            video.src = next;
            video.load();
        }
    }

    function bootHeroVideo() {
        const wrap = document.querySelector('.hero-video-bg');
        const video = document.querySelector('.hero-video-bg-media');
        if (!wrap || !video) return;

        const baseSrc = video.dataset.src || video.getAttribute('src') || '';
        if (!baseSrc) return;

        if (shouldSkip()) {
            wrap.classList.add('hero-video-bg--static');
            video.removeAttribute('autoplay');
            video.pause();
            return;
        }

        prepareVideo(video);

        let retryTimer = null;
        let retryCount = 0;
        const maxRetries = 24;

        function attemptPlay() {
            if (!video.src) assignSrc(video, baseSrc);

            if (video.paused) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise
                        .then(() => {
                            wrap.classList.remove('hero-video-bg--static');
                            video.loop = true;
                            if (retryTimer) {
                                clearInterval(retryTimer);
                                retryTimer = null;
                            }
                        })
                        .catch(() => {});
                }
            }
        }

        function scheduleRetries() {
            if (retryTimer) return;
            retryTimer = window.setInterval(() => {
                retryCount += 1;
                if (!video.paused || retryCount > maxRetries) {
                    clearInterval(retryTimer);
                    retryTimer = null;
                    return;
                }
                attemptPlay();
            }, 450);
        }

        function bindEvents() {
            if (wrap.dataset.videoBound === '1') return;
            wrap.dataset.videoBound = '1';

            ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach((evt) => {
                video.addEventListener(evt, () => {
                    if (isIOS() && video.currentTime < 0.01) {
                        try { video.currentTime = 0.001; } catch { /* ignore */ }
                    }
                    attemptPlay();
                }, { passive: true });
            });

            video.addEventListener('playing', () => {
                wrap.classList.remove('hero-video-bg--static');
            }, { passive: true });

            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) attemptPlay();
            });

            window.addEventListener('pageshow', attemptPlay);

            ['touchstart', 'touchend', 'click'].forEach((evt) => {
                document.addEventListener(evt, () => {
                    assignSrc(video, baseSrc);
                    attemptPlay();
                }, { once: true, passive: true });
            });

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            assignSrc(video, baseSrc);
                            attemptPlay();
                            scheduleRetries();
                        }
                    });
                }, { threshold: 0.05, rootMargin: '40px 0px' });
                observer.observe(wrap);
            }
        }

        bindEvents();
        assignSrc(video, baseSrc);
        attemptPlay();
        scheduleRetries();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootHeroVideo);
    } else {
        bootHeroVideo();
    }

    window.addEventListener('load', bootHeroVideo);
    window.addEventListener('pageshow', bootHeroVideo);
})();
