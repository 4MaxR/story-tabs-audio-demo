# Story Tabs Audio Demo

A production-clean, no-framework demo showing background audio autoplay with robust fallbacks and an auto-advancing story-like tabs system.

## 🚀 Features
- **Cinematic Audio**: Background music that attempts to autoplay and falls back to user interaction.
- **Auto-Switching Story**: 4 chapters that advance every 30 seconds.
- **Progressive UI**: Visual progress bars within tabs showing the current cycle.
- **Accessibility (A11y)**: Full ARIA tab patterns and keyboard navigation (Arrows/Home/End).
- **Responsive**: Mobile-first design that adapts to all screens.

## 📁 Project Structure
- `index.html`: Main structure and ARIA labels.
- `styles.css`: Dark-themed premium styles.
- `app.js`: Audio logic and tabs orchestration.
- `assets/audio/`: Directory for the background track.

## 🔊 How Autoplay Works
Modern browsers (Chrome, Safari, etc.) block audio from playing automatically to prevent intrusive experiences. This demo handles this behavior as follows:
1. **Initial Attempt**: The script tries to `play()` the audio on `DOMContentLoaded`.
2. **Success**: If the browser allows it (e.g., user has interacted with the domain before), the audio starts immediately.
3. **Fallback**: If blocked (most likely), a non-intrusive "Enter" overlay appears.
4. **Activation**: On the first user interaction (any click, tap, or key press), the audio starts, listeners are cleaned up, and the overlay disappears.

## 🎵 Replacing the Audio
To use your own background track:
1. Place your MP3 file in the `/assets/audio/` directory.
2. Ensure it is named `track.mp3` or update the `<source>` tag in `index.html`:
   ```html
   <audio id="bg-audio" loop>
       <source src="assets/audio/your-file-name.mp3" type="audio/mpeg">
   </audio>

## Audio Credit
Music by Pavel Bekirov from Pixabay.
Licensed under Pixabay Content License.

---

## 🛠 Technical Notes
- **No Frameworks**: Built with vanilla CSS and progressive JS.
- **State Management**: Uses a simple `currentTabIndex` and `requestAnimationFrame` for a smooth, battery-efficient progress bar animation.
- **Responsive Logic**: Tabs stack vertically on mobile while maintaining full functionality.
