/**
 * Story Tabs Audio Demo
 * Pure JavaScript, no dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CYCLE_DURATION = 30000; // 30 seconds

    // --- State ---
    let currentTabIndex = 0;
    let lastTime = 0;
    let progress = 0;
    let isAutoPlaying = true;
    let rafId = null;

    // --- DOM Elements ---
    const audio = document.getElementById('bg-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const statusText = document.getElementById('autoplay-status');
    const interactionPrompt = document.getElementById('interaction-prompt');
    const startBtn = document.getElementById('start-btn');

    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

    // --- Audio Controller ---

    const toggleAudio = () => {
        if (audio.paused) {
            audio.play().catch(err => console.log('Playback blocked:', err));
            updateAudioUI(true);
        } else {
            audio.pause();
            updateAudioUI(false);
        }
    };

    const updateAudioUI = (playing) => {
        if (playing) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            statusText.textContent = 'Audio On';
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            statusText.textContent = 'Audio Paused';
        }
    };

    // Robust Autoplay Handling
    const attemptAutoplay = () => {
        audio.volume = volumeSlider.value;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started!
                updateAudioUI(true);
            }).catch(() => {
                // Autoplay blocked - wait for interaction
                interactionPrompt.classList.remove('hidden');
                setupInteractionListeners();
            });
        }
    };

    const setupInteractionListeners = () => {
        const startExperience = () => {
            audio.play();
            updateAudioUI(true);
            interactionPrompt.classList.add('hidden');
            
            // Remove listeners after first interaction
            document.removeEventListener('click', startExperience);
            document.removeEventListener('keydown', startExperience);
            startBtn.removeEventListener('click', startExperience);
        };

        document.addEventListener('click', startExperience);
        document.addEventListener('keydown', startExperience);
        startBtn.addEventListener('click', startExperience);
    };

    // --- Tabs Controller ---

    const switchTab = (index) => {
        // Reset old tab
        tabs[currentTabIndex].setAttribute('aria-selected', 'false');
        tabs[currentTabIndex].setAttribute('tabindex', '-1');
        tabs[currentTabIndex].querySelector('.progress-fill').style.width = '0%';
        panels[currentTabIndex].hidden = true;

        // Set new tab
        currentTabIndex = index;
        tabs[currentTabIndex].setAttribute('aria-selected', 'true');
        tabs[currentTabIndex].setAttribute('tabindex', '0');
        panels[currentTabIndex].hidden = false;
        
        // Reset timer state
        progress = 0;
        lastTime = performance.now();
    };

    const nextTab = () => {
        const nextIndex = (currentTabIndex + 1) % tabs.length;
        switchTab(nextIndex);
    };

    // Animation Loop for Progress Bar
    const updateProgress = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        
        if (isAutoPlaying) {
            const elapsed = timestamp - lastTime;
            lastTime = timestamp;
            progress += elapsed;

            const percentage = Math.min((progress / CYCLE_DURATION) * 100, 100);
            const currentTabFill = tabs[currentTabIndex].querySelector('.progress-fill');
            if (currentTabFill) {
                currentTabFill.style.width = `${percentage}%`;
            }

            if (progress >= CYCLE_DURATION) {
                nextTab();
            }
        }

        rafId = requestAnimationFrame(updateProgress);
    };

    // --- Tab Accessibility & Interaction ---

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchTab(index);
        });

        tab.addEventListener('keydown', (e) => {
            let nextIndex = null;

            if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            if (e.key === 'Home') nextIndex = 0;
            if (e.key === 'End') nextIndex = tabs.length - 1;

            if (nextIndex !== null) {
                e.preventDefault();
                switchTab(nextIndex);
                tabs[nextIndex].focus();
            }
        });
    });

    // --- Event Listeners ---

    playPauseBtn.addEventListener('click', toggleAudio);

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // --- Initialization ---
    attemptAutoplay();
    rafId = requestAnimationFrame(updateProgress);
});
