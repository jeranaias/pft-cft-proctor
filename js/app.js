/**
 * PFT/CFT Proctor - Main Application
 * NAVMC 11622 Performance Worksheet Generator
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

/**
 * Theme management
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const icon = Utils.$('themeIcon');
  if (icon) {
    // Sun for dark mode (click to go light), Moon for light mode (click to go dark)
    icon.innerHTML = theme === 'dark' ? '&#9788;' : '&#9789;';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(theme);
}

/**
 * Keyboard shortcuts
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && !e.shiftKey && !e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'd':
          // Ctrl+D - Download PDF
          e.preventDefault();
          PreviewManager.downloadPDF();
          Utils.showStatus('info', 'Downloading PDF (Ctrl+D)');
          break;
        case 'p':
          // Ctrl+P - Print PDF
          e.preventDefault();
          PreviewManager.printPDF();
          break;
        case 's':
          // Ctrl+S - Export session
          e.preventDefault();
          SessionManager.exportSession();
          Utils.showStatus('success', 'Session exported (Ctrl+S)');
          break;
        case 'l':
          // Ctrl+L - Toggle live preview
          e.preventDefault();
          PreviewManager.toggle();
          break;
      }
    }

    // Escape - close modals/preview
    if (e.key === 'Escape') {
      PreviewManager.closeModal();
      PreviewManager.closePane();
    }
  });
}

/**
 * Offline indicator
 */
function updateOfflineIndicator(status, text) {
  const indicator = Utils.$('offline-indicator');
  if (!indicator) return;

  indicator.classList.remove('ready', 'offline');
  indicator.classList.add(status);

  const textEl = indicator.querySelector('.indicator-text');
  if (textEl) textEl.textContent = text;
}

function initOfflineIndicator() {
  window.addEventListener('online', () => {
    updateOfflineIndicator('ready', 'Back online');
    setTimeout(() => updateOfflineIndicator('ready', 'Ready offline'), 2000);
  });

  window.addEventListener('offline', () => {
    updateOfflineIndicator('offline', 'Offline mode');
  });

  if (!navigator.onLine) {
    updateOfflineIndicator('offline', 'Offline mode');
  }
}

/**
 * Service Worker registration
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          updateOfflineIndicator('ready', 'Ready offline');
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
          updateOfflineIndicator('offline', 'Online only');
        });
    });
  } else {
    updateOfflineIndicator('offline', 'Online only');
  }
}

/**
 * Global API for onclick handlers
 * (These bridge HTML onclick to module methods)
 */
const App = {
  // Theme
  toggleTheme,

  // Form handlers
  toggleSection: (id) => FormHandler.toggleSection(id),
  adjustCount: (type, delta) => FormHandler.adjustCount(type, delta),
  addMarineToWorksheet: () => FormHandler.addMarineToWorksheet(),
  clearForm: () => FormHandler.clearForm(),

  // Scoring
  setUpperEvent: (type) => ScoringCalculator.setUpperEvent(type),
  setCardioEvent: (type) => ScoringCalculator.setCardioEvent(type),
  calculateScores: () => ScoringCalculator.triggerPFTUpdate(),
  calculateCFTScores: () => ScoringCalculator.triggerCFTUpdate(),

  // Session
  clearAllMarines: () => SessionManager.clearAll(),
  exportSession: () => SessionManager.exportSession(),
  loadExample: () => SessionManager.loadExampleRoster(),

  // Preview
  togglePreview: () => PreviewManager.toggle(),
  generateNAVMC: () => PreviewManager.downloadPDF(),
  previewNAVMC: () => PreviewManager.openMobilePreview(),
  closePreview: () => PreviewManager.closeModal()
};

/**
 * Initialize the application
 */
async function initApp() {
  console.log('PFT/CFT Proctor v2.0 initializing...');

  // Initialize theme immediately (prevents flash)
  initTheme();

  // Initialize core modules
  FormHandler.init();
  ScoringCalculator.init();
  SessionManager.init();

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();

  // Defer non-critical initialization
  requestAnimationFrame(() => {
    PreviewManager.init();
    initOfflineIndicator();
  });

  // Register service worker last
  registerServiceWorker();

  console.log('PFT/CFT Proctor v2.0 ready!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
